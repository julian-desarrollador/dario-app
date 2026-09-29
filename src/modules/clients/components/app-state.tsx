"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/modules/clients/application/legacy-migration.ts";
import {
  downloadDataUrl,
  loadClients,
  saveClients,
} from "@/modules/clients/adapters/outbound/browser-client-store.ts";
import { areaCodeFor } from "@/modules/clients/application/legacy-migration.ts";
import { buildDocCode, nextDocumentSequence, todayISO } from "@/modules/expediente/domain/document-code.ts";
import { keepsBinary } from "@/modules/expediente/domain/record-lifecycle.ts";
import {
  approveVersion,
  deletePendingVersion,
  findRequirement,
  toggleTask,
  uploadVersion,
  type FileInput,
} from "@/modules/expediente/domain/record-lifecycle.ts";
import type { Client, Requirement } from "@/modules/expediente/domain/model.ts";
import { areaRequirements } from "@/modules/expediente/domain/progress.ts";
import {
  SIGNERS,
  currentUser,
  login as persistLogin,
  logout as persistLogout,
  type SessionUser,
} from "@/modules/session/index.ts";

type UploadCommand = {
  clientId: string;
  areaId: string;
  requirementId: string;
  signer: { id: string; name: string } | null;
  documentDate: string;
  dueDate?: string;
  code?: string;
  file?: File;
};

type AppContextValue = {
  ready: boolean;
  user: SessionUser | null;
  clients: Client[];
  notice: string;
  signers: typeof SIGNERS;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addClient: (input: Omit<Client, "id" | "areas">) => void;
  upload: (command: UploadCommand) => Promise<void>;
  approve: (clientId: string, requirementId: string) => void;
  removePending: (clientId: string, requirementId: string) => void;
  toggle: (clientId: string, requirementId: string) => void;
  download: (requirement: Requirement) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [notice, setNotice] = useState("");
  const [sessionFiles, setSessionFiles] = useState<Record<string, string>>({});

  useEffect(() => {
    setUser(currentUser());
    setClients(loadClients());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveClients(clients);
  }, [clients, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      user,
      clients,
      notice,
      signers: SIGNERS,
      login(username, password) {
        const session = persistLogin(username, password);
        if (!session) return false;
        setUser(session);
        return true;
      },
      logout() {
        persistLogout();
        setUser(null);
      },
      addClient(input) {
        const id = `cli-${Date.now()}`;
        setClients((prev) => createClient(prev, { ...input, id }));
        setNotice("Cliente creado.");
      },
      async upload(command) {
        if (!user) return;
        let file: FileInput | undefined;
        let sessionOnly = false;
        if (command.file) {
          const dataUrl = await readFile(command.file);
          file = {
            name: command.file.name,
            mime: command.file.type || "application/octet-stream",
            dataUrl,
            byteLength: command.file.size,
          };
          sessionOnly = !keepsBinary(command.file.size);
        }
        const id = `up-${Date.now()}`;
        const area = clients
          .find((item) => item.id === command.clientId)
          ?.areas.find((item) => item.id === command.areaId);
        const existing = findRequirement(clients, command.clientId, command.requirementId);
        const usedCodes = area
          ? areaRequirements(area).flatMap((item) =>
              [item.current, ...item.previous].flatMap((version) => (version?.code ? [version.code] : [])),
            )
          : [];
        const code =
          command.code?.trim() ||
          existing?.current?.code ||
          buildDocCode({
            kind: "D",
            areaCode: areaCodeFor(command.areaId),
            sequence: nextDocumentSequence(usedCodes),
            dateISO: command.documentDate || todayISO(),
          });
        setClients((prev) => {
          const result = uploadVersion(prev, {
            clientId: command.clientId,
            requirementId: command.requirementId,
            actor: user,
            signer: command.signer,
            documentDate: command.documentDate,
            dueDate: command.dueDate,
            code,
            file,
            now: new Date().toISOString(),
            id,
          });
          return result.ok ? result.clients : prev;
        });
        if (sessionOnly && file) {
          setSessionFiles((prev) => ({ ...prev, [id]: file.dataUrl }));
          setNotice(
            "Archivo grande: se puede descargar en esta sesión, pero no queda guardado al recargar.",
          );
        } else {
          setNotice("Documento guardado. Queda pendiente el OK del firmante.");
        }
      },
      approve(clientId, requirementId) {
        if (!user) return;
        let approved = false;
        setClients((prev) => {
          const result = approveVersion(prev, clientId, requirementId, user, new Date().toISOString());
          approved = result.ok;
          return result.ok ? result.clients : prev;
        });
        setNotice(approved ? "OK del firmante registrado." : "No podés dar el OK de este registro.");
      },
      removePending(clientId, requirementId) {
        if (!user) return;
        let removed = false;
        setClients((prev) => {
          const result = deletePendingVersion(
            prev,
            clientId,
            requirementId,
            user,
            new Date().toISOString(),
          );
          removed = result.ok;
          return result.ok ? result.clients : prev;
        });
        setNotice(removed ? "Versión eliminada." : "Este registro no se puede eliminar.");
      },
      toggle(clientId, requirementId) {
        setClients((prev) => toggleTask(prev, clientId, requirementId));
      },
      download(requirement) {
        const current = requirement.current;
        const dataUrl = current?.fileData || (current ? sessionFiles[current.id] : undefined);
        if (!dataUrl || !current?.fileName) {
          setNotice("Este requisito todavía no tiene archivo.");
          return;
        }
        downloadDataUrl(dataUrl, current.fileName);
      },
    }),
    [clients, notice, ready, sessionFiles, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppState necesita AppStateProvider");
  return value;
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
