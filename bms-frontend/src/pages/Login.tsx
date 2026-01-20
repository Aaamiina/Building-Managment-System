// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginRequest } from "../api/auth.api"; // <-- your backend API
// import { toast } from "sonner";

// export function Login() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     const form = e.currentTarget;
//     const email = (form.elements.namedItem("email") as HTMLInputElement).value;
//     const password = (form.elements.namedItem("password") as HTMLInputElement).value;

//     // try {
//     //   const res = await loginRequest({ email, password });

//     //   // store token
//     //   localStorage.setItem("token", res.token);
//     //   localStorage.setItem("user", JSON.stringify(res.user));

//     //   toast.success("Login successful");
//     //   navigate("/dashboard");
//     // } catch (error) {
//     //   toast.error("Invalid email or password");
//     // } finally {
//     //   setLoading(false);
//     // }


//     // Inside your handleSubmit function, replace navigate("/dashboard") with this:
// try {
//   const res = await loginRequest({ email, password });

//   // 1. Store data
//   localStorage.setItem("token", res.token);
//   localStorage.setItem("user", JSON.stringify(res.user));

//   toast.success(`Welcome back, ${res.user.name}`);

//   // 2. Role-Based Navigation
//   const role = res.user.role; // Ensure your backend returns 'ADMIN', 'MANAGER', or 'SUB_MANAGER'

//   switch (role) {
//     case "SUPER_ADMIN":
//       navigate("/dashboard");
//       break;
//     case "MANAGER":
//       navigate("/manDash");
//       break;
//     case "SUB_MANAGER":
//       navigate("/manDash");
//       break;
//     default:
//       navigate("/dashboard"); // Fallback
//   }
// } catch (error) {
//   toast.error("Invalid email or password");
// }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br 
//       from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">

//       <div className="w-full max-w-md">
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          
//           {/* Title */}
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//               Building Management System
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               Sign in to access your dashboard
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Email
//               </label>
//               <input
//                 name="email"
//                 type="email"
//                 required
//                 placeholder="admin@example.com"
//                 className="w-full rounded-xl border border-gray-300 dark:border-gray-700
//                   bg-white dark:bg-gray-900 px-4 py-3
//                   text-gray-900 dark:text-white
//                   focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Password
//               </label>
//               <input
//                 name="password"
//                 type="password"
//                 required
//                 placeholder="••••••••"
//                 className="w-full rounded-xl border border-gray-300 dark:border-gray-700
//                   bg-white dark:bg-gray-900 px-4 py-3
//                   text-gray-900 dark:text-white
//                   focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-xl bg-blue-600 hover:bg-blue-700
//                 text-white font-semibold py-3 transition
//                 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </button>
//           </form>

//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth.api"; 
import { toast } from "sonner";
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await loginRequest({ email, password });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success(`Welcome back, ${res.user.name}`);

      const role = res.user.role; 

      switch (role) {
        case "SUPER_ADMIN":
          navigate("/dashboard");
          break;
        case "MANAGER":
          navigate("/manDash");
          break;
        case "SUB_MANAGER":
          navigate("/manDash");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0c10]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')`, // Waxaad ku beddeli kartaa sawirkaaga rasmiga ah
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c10]/60 to-[#0a0c10]/90 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="bg-[#161b22]/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl p-8">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 shadow-lg shadow-blue-600/20">
              <LockClosedIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">
              BMS Secure Login
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Professional Building Management System
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-[#0d1117] border border-gray-700 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <button type="button" className="text-[11px] font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0d1117] border border-gray-700 text-white text-sm rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center px-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-700 bg-[#0d1117] text-blue-600 focus:ring-blue-500 focus:ring-offset-[#161b22]"
              />
              <label htmlFor="remember" className="ml-2 text-xs font-medium text-gray-400">
                Remember this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
             <p className="text-gray-500 text-xs font-medium">
              New tenant? <button className="text-blue-500 hover:underline font-bold">Contact Administrator</button>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-[2px]">
          <div className="h-[1px] w-8 bg-gray-800"></div>
          <span className="flex items-center gap-1.5">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            Secure 256-bit Encrypted Connection
          </span>
          <div className="h-[1px] w-8 bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
}
