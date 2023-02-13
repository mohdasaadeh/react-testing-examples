import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { login } from "../utils";

type Input = {
  email: string;
  password: string;
};

export const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Input>();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    login(data);

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center space-y-2"
    >
      <div>
        <label htmlFor="email" className="mr-2">
          email
        </label>
        <input
          id="email"
          {...register("email", {
            required: "required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format",
            },
          })}
          type="email"
          className="border"
        />
        {errors.email && <span role="alert">{errors.email.message}</span>}
      </div>
      <div>
        <label htmlFor="password" className="mr-2">
          password
        </label>
        <input
          id="password"
          {...register("password", {
            required: "required",
            minLength: {
              value: 5,
              message: "min length is 5",
            },
          })}
          type="password"
          className="border"
        />
        {errors.password && <span role="alert">{errors.password.message}</span>}
      </div>
      <button type="submit" className="bg-indigo-900 px-4 py-1">
        SUBMIT
      </button>
    </form>
  );
};
