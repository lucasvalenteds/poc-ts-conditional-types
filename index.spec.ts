import Axios, { AxiosInstance } from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { v4 as UUID } from "uuid";
import { send, Message } from "./";

const httpClient: AxiosInstance = Axios.create();
const mock: AxiosMockAdapter = new AxiosMockAdapter(httpClient);

const mockMessage: Message = {
  id: UUID(),
  delivered: true,
};

test("Sending plain text message", async () => {
  mock.onPost("/messages/text").reply(200, mockMessage);

  const message = await send(
    "text",
    {
      personId: UUID(),
      text: "Hello World!",
    },
    httpClient
  );

  expect(message).toStrictEqual(mockMessage);
});

test("Sending checklist message", async () => {
  mock.onPost("/messages/checklist").reply(200, mockMessage);

  const message = await send(
    "checklist",
    {
      personId: UUID(),
      items: ["Item 1", "Item 2", "Item 3"],
    },
    httpClient
  );

  expect(message).toStrictEqual(mockMessage);
});

test("Handling request error", async () => {
  expect.assertions(1);
  mock.onPost("/messages/text").networkError();

  try {
    await send(
      "text",
      {
        personId: "",
        text: "",
      },
      httpClient
    );
  } catch (error) {
    expect(error.message).toStrictEqual("Network Error");
  }
});
