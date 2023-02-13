import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

import App from "../App";
import { login } from "../utils";

jest.mock("../utils", () => {
  const originalModule = jest.requireActual("../utils");

  return {
    __esModule: true,
    ...originalModule,
    login: jest.fn((body: { [key: string]: string }) => {
      console.log(body);
    }),
  };
});

it("should display required error when value is invalid", async () => {
  render(<App />);

  fireEvent.submit(screen.getByRole("button"));

  expect(await screen.findAllByRole("alert")).toHaveLength(2);
  expect(login).not.toBeCalled();
});

it("should display matching error when email is invalid", async () => {
  render(<App />);

  fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
    target: {
      value: "test",
    },
  });

  fireEvent.input(screen.getByLabelText("password"), {
    target: {
      value: "password",
    },
  });

  fireEvent.submit(screen.getByRole("button"));

  expect(await screen.findAllByRole("alert")).toHaveLength(1);
  expect(login).not.toBeCalled();
  expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("test");
  expect(screen.getByLabelText("password")).toHaveValue("password");
});

it("should display min length error when password is invalid", async () => {
  render(<App />);

  fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
    target: {
      value: "test@mail.com",
    },
  });

  fireEvent.input(screen.getByLabelText("password"), {
    target: {
      value: "pass",
    },
  });

  fireEvent.submit(screen.getByRole("button"));

  expect(await screen.findAllByRole("alert")).toHaveLength(1);
  expect(login).not.toBeCalled();
  expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue(
    "test@mail.com"
  );
  expect(screen.getByLabelText("password")).toHaveValue("pass");
});

it("should not display error when value is valid", async () => {
  render(<App />);

  fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
    target: {
      value: "test@mail.com",
    },
  });

  fireEvent.input(screen.getByLabelText("password"), {
    target: {
      value: "password",
    },
  });

  await act(async () => {
    fireEvent.submit(screen.getByRole("button"));
  });

  await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
  expect(login).toBeCalledWith({
    email: "test@mail.com",
    password: "password",
  });
  expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");
  expect(screen.getByLabelText("password")).toHaveValue("");
});
