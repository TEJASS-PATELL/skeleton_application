import "../style/SignUp.css";
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

import toast from "react-hot-toast";
import { useAuthStore } from "../stores/useAuth"

export default function SignUp() {
  const navigator = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termAndcondition: false,
  });

  const validateForm = () => {
    const { name, email, password, confirmPassword, termAndcondition } = formData;
    if (!name.trim()) return toast.error("Full Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    if (!password) return toast.error("Password is required");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (!termAndcondition) return toast.error("Please accept term & condition");
    return true;
  };

  const { signup, isLoading, sendOtp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await signup(formData);

    if (result.success) {
      localStorage.setItem("verifyEmail", formData.email);

      if (!result.redirectToVerify) {
        const otpSent = await sendOtp();
        if (!otpSent) return;
      }

      navigator("/signup/verify-email");
    }

  };

  return (
    <div className="main-container">
      <form className='sigup-form' onSubmit={handleSubmit}>
        <h1>Create a free account</h1>
        <div className='sinup-div'>
          <label htmlFor='name'>Name <input onChange={e => setFormData({ ...formData, name: e.target.value })} value={formData.name} id='name' required placeholder='Name'></input></label>
          <label htmlFor='email'>Email <input onChange={e => setFormData({ ...formData, email: e.target.value })} value={formData.email} id='email' required placeholder='example@gmail.com'></input></label>
          <label htmlFor='password'>Password <input type={showPassword ? "text" : "password"} onChange={e => setFormData({ ...formData, password: e.target.value })} value={formData.password} id='password' required placeholder="••••••••"></input></label>
          <small className="password-help">Password must be at least 8 characters.</small>
          <label
            htmlFor='confirmpassword'
            style={{ position: "relative"}}>
            Confirm Password
            <input
              id='confirmpassword'
              type={showPassword ? "text" : "password"}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              value={formData.confirmPassword}
              required
              placeholder="••••••••"
            />

            <span
              onClick={() => setShowPassword(prev => !prev)}
              style={{
                position: "absolute",
                right: "15px",
                top: "70%", 
                transform: "translateY(-50%)",
                cursor: "pointer",
                userSelect: "none"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>

          <div className="checkbox-container">
            <input type="checkbox" id="terms" required onChange={e => setFormData({ ...formData, termAndcondition: e.target.checked })} />
            <Link to="/terms-and-conditions">I agree to the Terms & Conditions</Link>
          </div>
          <button type='submit' className='signupbtn' disabled={isLoading}>{isLoading ? "Signing Up..." : "Sign Up"}</button>
        </div>
        <p className='signup-text'>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
