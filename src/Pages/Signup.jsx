import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import Navbar2 from '../Components/Navbar2';
import axiosinstance from '../axios/axios.js';
import toast from 'react-hot-toast';
import { OtpVerification, SignupUser } from '../Redux/features/auth.jsx';
import { useDispatch } from 'react-redux';

const Signup = () => {
    // const location = useLocation();
    const [loading, setLoading] = useState(false
        // () => {
        // if (location.state) {
        //     console.log(location)
        //     return location.state?.from !== 'login';
        // }
        // return true
        // }
    );
    // Simulate loading end after 4 seconds
    useEffect(() => {

        // const timer = setTimeout(() => setLoading(false), 3000);
        // return () => clearTimeout(timer);
    }, []);

    const dispatch = useDispatch()
    const [formdata, setformdata] = useState({ name: '', email: '', password: '', role: '' })
    const [email, setEmail] = useState('')
    const [showForm, setShowForm] = useState('form1')
    const navigate = useNavigate()
    // console.log(formdata)
    const changeHandler = (e) => {
        setformdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }))

        // console.log(formdata)
        // console.log(email)
    }
    const formHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(SignupUser(formdata))
            // console.log(response)
            if (SignupUser.fulfilled.match(response)) {
                toast.success(response?.payload?.message);
                setShowForm('form2')
            }
            else {
                toast.error(response?.payload)
            }
        } catch (error) {
            toast.error(error)
        }

        setformdata({ name: '', email: '', password: '', role: '' })
    }


    //OTP Verification Logic
    const inputRefs = useRef([]);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [Formdata1, setFormdata1] = useState({ OTP: '' })
    const [ResendData, setResendData] = useState({})
    useEffect(() => {
        setFormdata1((Formdata1) => ({ ...Formdata1, OTP: otp.join(''), email: email }))
    }, [otp])
    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d?$/.test(value)) return; // only allow a single digit
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if not last and value is not empty
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1].focus();
        }
    };
    const OTP_Handler = async (e) => {
        e.preventDefault();
        // console.log(Formdata1)
        try {
            const response = await dispatch(OtpVerification(Formdata1))
            // console.log(response)
            if (OtpVerification.fulfilled.match(response)) {
                toast.success(response?.payload?.message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
                setFormdata1({ OTP: '', email: '' })
            }
            else {
                toast.error(response?.payload)
            }
        } catch (error) {
            toast.error(error)
        }

    }
    const ResendOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(ResendOTP(ResendData))
            // console.log(response)
            if (ResendOTP.fulfilled.match(response)) {
                toast.success(response?.payload?.message);
            }
            else {
                toast.error(response?.payload)
            }
        } catch (error) {
            toast.error(error)
        }

    }



    return (<>
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="loader"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: .5 } }}
                >
                    {/* <Loading2 /> */}
                </motion.div>
            ) : (
                <motion.div
                    key="main"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                // transition= {{ duration: 1 }}    
                >
                    <Navbar2 />
                    <div className=' bg-[#080708]  pt-0'>
                        <div className="min-h-screen flex flex-row items-center  justify-center lg:container md:px-5 mx-auto ">

                            <motion.div
                                key={'text'}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3 }}
                                className="text mx-5 w-full hidden lg:flex flex-col">
                                <h1 className='text-cyan-400 text-8xl -mb-1 font-hadayat ' >Saair</h1>
                                <h2 className='text-3xl text-gray-300 -ml-4  font-saira  font-semibold'>Companion of a Traveler</h2>
                            </motion.div>
                            <AnimatePresence mode='wait'>


                                {showForm == 'form1' && <motion.div
                                    key={'card'}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.5 }}
                                    className="md:bg-[#141414] md:shadow-2xl p-8 rounded-lg md:border border-gray-900 w-full lg:mr-20 max-w-[450px] max-h-[600px]">
                                    {/* <h2 className="text-2xl font-bold text-center lg:block hidden text-gray-700   mb-6">Sign up</h2> */}
                                    <h1 className='text-cyan-400 text-4xl mb-4 font-hadayat lg:hidden text-center ' >Saair</h1>

                                    <form onSubmit={formHandler} className="space-y-5 mt-5">
                                        <div>
                                            <input
                                                id="fullName"
                                                type="text"
                                                placeholder='Full Name'
                                                name='name'
                                                value={formdata.name}
                                                onChange={changeHandler}
                                                required
                                                className="w-full px-4 py-3 rounded-md border bg-black border-transparent focus:border-cyan-400 focus:bg-black focus:outline-none focus:border font-semibold text-sm placeholder:text-gray-500 text-gray-300 transition-all duration-200 shadow-sm active:shadow-lg active:border-cyan-400 hover:border-cyan-400 hover:bg-black "
                                            />
                                        </div>

                                        <div>
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder='Email'
                                                name='email'
                                                autoComplete='email'
                                                value={formdata.email}
                                                onChange={(e) => { setformdata((formdata) => ({ ...formdata, email: e.target.value })); setEmail(e.target.value) }}
                                                required
                                                className="w-full px-4 py-3 rounded-md border bg-black border-transparent focus:border-cyan-400 focus:bg-black focus:outline-none focus:border font-semibold text-sm placeholder:text-gray-500 text-gray-300 transition-all duration-200 shadow-sm active:shadow-lg active:border-cyan-400 hover:border-cyan-400 hover:bg-black "
                                            />
                                        </div>

                                        <div>
                                            <input
                                                id="password"
                                                type="password"
                                                placeholder='Password'
                                                name='password'
                                                value={formdata.password}
                                                onChange={changeHandler}
                                                autoComplete='current-password'
                                                required
                                                className="w-full px-4 py-3 rounded-md border bg-black border-transparent focus:border-cyan-400 focus:bg-black focus:outline-none focus:border font-semibold text-sm placeholder:text-gray-500 text-gray-300 transition-all duration-200 shadow-sm active:shadow-lg active:border-cyan-400 hover:border-cyan-400 hover:bg-black "
                                            />
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    className="w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-cyan-400 checked:border-transparent focus:outline-none  accent-cyan-400  focus:bg-cyan-400"
                                                    required
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="terms" className="text-gray-500">
                                                    I agree to your Terms ,{" "}
                                                    <Link to="#" className="text-cyan-400 hover:underline">
                                                        Privacy Policy                                    </Link>{" "}
                                                    and{" "}
                                                    <Link to="#" className="text-cyan-400 hover:underline">
                                                        Cookies Policy
                                                    </Link>
                                                    .
                                                </label>
                                            </div>
                                        </div>
                                        <div className="btn">

                                            <button
                                                type="submit"
                                                className="w-full bg-cyan-400 hover:bg-cyan-600 text-black font-semibold py-1 px-4 rounded-md transition duration-200 h-9 font-saira hover:shadow-md shadow-gray-900"
                                            >
                                                Sign Up
                                            </button>
                                        </div>
                                    </form>

                                    <div className="text-center mt-4 text-gray-500">
                                        Already have an account?{" "}
                                        <Link to="/Login" state={{ from: "signup" }} className="text-cyan-400 hover:underline">
                                            Sign in
                                        </Link>
                                    </div>
                                </motion.div>}
                                {showForm == 'form2' && <ArrowLeftIcon onClick={() => { setShowForm('form1') }} className='absolute size-4 lg:size-5 lg:left-10 lg:top-10 left-7 top-7 hover:text-cyan-600' />}
                                {showForm == 'form2' && <h1 className='absolute min-w-max lg:size-5 lg:right-10 lg:top-10 right-7 top-7 hover:text-cyan-600'>Step - 2</h1>}
                                {showForm == 'form2' && <motion.div
                                    key={'card1'}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.3 }}
                                    className="md:bg-[#141414] md:shadow-2xl p-8 rounded-lg md:border border-gray-900 w-full lg:mr-20 max-w-[450px] max-h-[600px] relative">

                                    <h1 className='text-cyan-400 text-4xl mb-4 font-hadayat lg:hidden text-center ' >Saair</h1>
                                    <h2 className="text-2xl text-gray-300 font-bold text-center lg:block hidden mb-4">Enter 6 Digit OTP</h2>
                                    {/* <h1 className="text-center mt-3 text-gray-500  mb-3">Enter OTP You Recievd in Email</h1> */}


                                    <div className='flex flex-col justify-center '>
                                        <form onSubmit={OTP_Handler}>
                                            <div className="boxs flex justify-between lg:gap-5 gap-3 mb-5">
                                                {otp.map((digit, index) => (
                                                    <input
                                                        key={index}
                                                        ref={(el) => (inputRefs.current[index] = el)}
                                                        type="text"
                                                        maxLength="1"
                                                        value={digit}
                                                        onChange={(e) => handleChange(e, index)}
                                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                                        className=' bg-black border-transparent  focus:bg-black focus:outline-none focus:border font-semibold    active:border-cyan-400 focus:border-cyan-400 focus:shadow-md shadow-cyan-400 active:outline-none outline outline-none transition-all duration-300 ease-in-out placeholder:text-gray-600 text-white w-[40px] h-[50px] rounded-md text-center text-2xl'
                                                    />
                                                ))}
                                            </div>
                                            <div className="btn">

                                                <button
                                                    type="submit"
                                                    className="w-full bg-cyan-400 hover:bg-cyan-600 text-black font-semibold py-1 px-4 rounded-md transition duration-200 h-9 font-saira hover:shadow-md shadow-gray-900"
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </form>
                                        <h1 className="text-center mt-3 text-gray-400  mb-3">OTP will be Expired Within 2 Minutes.{''} <Link onClick={ResendOTP} className="text-cyan-400 hover:underline">
                                            Resend?
                                        </Link></h1>

                                    </div>
                                </motion.div>}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence></>)
}

export default Signup
