import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
// import { auth } from "../../lib/firebase"; 
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleLogo from "../assets/googleLogo.jpg";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3060/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const user = await response.json();
        alert("Login successful!");
        login(user);
        localStorage.setItem("username", username);
        localStorage.setItem("userId", user.id);
        window.location.href = "/";
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error logging in");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const response = await signInWithPopup(auth, provider);
      alert("Google login successful!");
      login(response.user);
      window.location.href = "/";
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex-1 p-8 bg-purple-600 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Energize</h1>
          <p className="mb-6">
            Welcome to FitnessConnect, your ultimate destination for connecting with fellow fitness enthusiasts!
          </p>
          <span className="mb-2">Don't have an account?</span>
          <Link to="/register">
            <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded hover:bg-gray-200 transition">
              Register
            </button>
          </Link>
        </div>

        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition">
              Login
            </button>
            <button onClick={handleGoogleSignIn} type="button" className="flex items-center justify-center border py-3 rounded hover:bg-gray-100">
              <img src={GoogleLogo} alt="Google logo" className="w-6 h-6 mr-3" />
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
