import { useState } from "react";
import axios from "axios";

function LoginRegister({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister
        ? "http://localhost:9000/api/auth/register"
        : "http://localhost:9000/api/auth/login";
      const payload = isRegister ? { name, email, password } : { email, password };

      const res = await axios.post(endpoint, payload);

      if (!isRegister) {
        // ✅ Save user details
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("name", res.data.user.name);

        onLogin(res.data.user);
      } else {
        alert("Registration successful! Please log in.");
        setIsRegister(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80 transition-all duration-300"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          {isRegister ? "Create Account" : "Login"}
        </h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full mb-3 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-3">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginRegister;
