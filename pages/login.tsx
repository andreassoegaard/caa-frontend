import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const isAuthenticated = useAuth(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // "username-login" matches the id for the credential
    signIn("credentials", { email, password, redirect: false }).then(
      ({ ok, error }: any) => {
        if (ok) {
          router.push("/");
        } else {
          console.log(error);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          name='username'
          type='text'
          placeholder='Username'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div>
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
}
