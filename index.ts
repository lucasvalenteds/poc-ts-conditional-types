import Axios, { AxiosInstance } from "axios";

const DefaultHttpClient: AxiosInstance = Axios.create({
  baseURL: "http://localhost:8080",
});

export interface Message {
  id: string;
  delivered: boolean;
}

type HasPersonId = { personId: string };

type TextInput = { text: string } & HasPersonId;

type ChecklistInput = {
  items: string[] & { 0: string };
} & HasPersonId;

type MessageType =
  | ({ name: "text" } & TextInput)
  | ({ name: "checklist" } & ChecklistInput);

type MessagePayload = MessageType["name"];

type ExcludeNameKey<K> = K extends "name" ? never : K;

type ExcludeNameField<M> = { [key in ExcludeNameKey<keyof M>]: M[key] };

type ExtractMessagePayload<M, P> = M extends { name: P }
  ? ExcludeNameField<M>
  : never;

export async function send<M extends MessagePayload>(
  messageType: M,
  payload: ExtractMessagePayload<MessageType, M>,
  httpClient: AxiosInstance = DefaultHttpClient
): Promise<Message> {
  return httpClient
    .post<Message>(`/messages/${messageType}`, payload)
    .then((response) => response.data);
}
