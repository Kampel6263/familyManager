import bcrypt from "bcryptjs";
import { useState } from "react";

const bcryptLength = 10;

const useBcrypt = () => {
  const encryptPass = (password: string) => {
    const hash = btoa(password);
    return hash;
  };
  const decryptPass = (encryptedPassword: string) => {
    return atob(encryptedPassword);
  };
  const matchPass = ({
    hashedPassword,
    password,
  }: {
    hashedPassword: string;
    password: string;
  }) => {
    const decodedPassword = atob(hashedPassword);
    return decodedPassword === password;
  };
  return { encryptPass, decryptPass, matchPass };
};

export default useBcrypt;
