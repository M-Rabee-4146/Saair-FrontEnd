import { motion, AnimatePresence } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router';
import Navbar from '../Components/Navbar';
import Navbar2 from '../Components/Navbar2';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axiosinstance from '../axios/axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { ForgotPassword, Loginuser } from '../Redux/features/auth';
// import toast from 'react-hot-toast'
// import axiosinstance from '../axios/axios'

const Login = () => {
    const location = useLocation();
    //     const from= location.state?.from;
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(
        //         // () => {
        //         // if (location.state) {
        //         //     console.log(location)
        //         //     return location.state?.from !== 'signup'||location.state?.from !== '/';
        //         // }
        //         // return true
        //     // }
        false
    );
    //     // Simulate loading end after 4 seconds
    useEffect(() => {
        //         const timer = setTimeout(() => setLoading(false), 3000);
        //         return () => clearTimeout(timer);
    }, []);

    const [formdata, setformdata] = useState({ email: '', password: '' })
    const [Forgetformdata, setForgetformdata] = useState({ email: '' })
    const [formNum, setformNum] = useState('form1')
    //     // console.log(formdata)
    const changeHandler = (e) => {
        setformdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }))
        // console.log(formdata)
    }
    //     // console.log(from)
    const formHandler = async (e) => {
        e.preventDefault();
        // setLoading(true)
        try {
            const response = await dispatch(Loginuser(formdata))
            // console.log(response)
            if (Loginuser.fulfilled.match(response)) {
                // toast.success(response?.payload?.message);
                if (response.payload.user.role == 'admin') {
                    navigate('/Dashboard')
                }
                else if (location.state.from == 'signup') {
                    navigate('/Shop')
                }else{
                    navigate(-1)
                }
                

            }
            else {
                toast.error(response?.payload ,{style:{ background:'#191919',color:'white',border:'1px solid cyan'}})
            }   
        } catch (error) {
            toast.error(error)
        }
        setformdata({ email: '', password: '' })
    }
    const forgetFormHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(ForgotPassword(Forgetformdata))
            // console.log(response)
            if (ForgotPassword.fulfilled.match(response)) {
                toast.success(response?.payload?.message);
            }
            else {
                toast.error(response?.payload)
            }
        } catch (error) {
            toast.error(error)
        }
        setForgetformdata({ email: '' })
    }
    return (<><AnimatePresence mode="wait"> {loading ? (
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
        // transition={{duration:.5}}
        >
            <Navbar2 />
            <div className='  bg-[#080708]'>
                <div className="min-h-screen flex flex-row items-center justify-center lg:container md:px-5 mx-auto ">

                    <div className="text mx-5 ml-10 w-full hidden lg:flex flex-col">
                        <h1 className='text-cyan-500 text-8xl -mb-1 font-hadayat  ' >Saair</h1>
                        <h2 className='text-3xl text-gray-300 -ml-4  font-saira  font-semibold'>Companion of a Traveler</h2>
                    </div>
                    <AnimatePresence mode='wait'>
                        {formNum == 'form1' && <motion.div
                            key={'form1'}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="md:bg-[#141414] md:shadow-2xl p-8 rounded-lg md:border border-gray-900 w-full lg:mr-20 max-w-[450px] max-h-[600px]">
                            {/* <h2 className="text-2xl font-bold text-center :block hidden text-gray-300 mb-6">Log in</h2> */}
                            <h1 className='text-cyan-500 text-4xl mb-4 font-hadayat lg:hidden text-center ' >Saair</h1>

                            <form onSubmit={formHandler} className="space-y-5 mt-5">

                                <div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder='Email'
                                        name='email'
                                        autoComplete='email'
                                        value={formdata.email}
                                        onChange={changeHandler}
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
                                <div className='flex justify-between items-center'>
                                    <div className="chechbox flex ">
                                        <div className="flex items-center h-5 radio">
                                            <input
                                                id="Remember"
                                                type="checkbox"
                                                className="w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-cyan-400 checked:border-transparent focus:outline-none  accent-cyan-400  focus:bg-cyan-600"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="Remember" className="text-gray-500">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                    <Link onClick={() => setformNum('form2')} className="text-cyan-500 hover:underline">Forget Password</Link>
                                </div>

                                {/* <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="w-4 h-4 border-2 border-gray-400 rounded-sm checked:bg-cyan-600 checked:border-transparent focus:outline-none  accent-cyan-600  focus:bg-cyan-600"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-600">
                                    I certify that I am 18 years of age or older, and agree to the{" "}
                                    <Link to="#" className="text-cyan-500 hover:underline">
                                        User Agreement
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="#" className="text-cyan-500 hover:underline">
                                        Privacy Policy
                                    </Link>
                                    .
                                </label>
                            </div>
                        </div> */}
                                <div className="btn">

                                    <button
                                        type="submit"
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-1 px-4 rounded-md transition duration-200 h-9 font-saira hover:shadow-md shadow-gray-900"
                                    >
                                        Log in
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-6 text-gray-500">
                                Don't Have account?{" "}
                                <Link to="/Signup" state={{ from: 'login' }} className="text-cyan-500 hover:underline">
                                    Sign Up
                                </Link>
                            </div>
                        </motion.div>}

                        {formNum == 'form2' && <ArrowLeftIcon onClick={() => { setformNum('form1') }} className='absolute size-5 lg:size-5 lg:left-10 lg:top-20 left-7 top-17 hover:text-cyan-600 text-gray-300' />}
                        {formNum == 'form2' && <h1 className='absolute min-w-max lg:size-5 lg:right-10 lg:top-20 right-7 top-15 hover:text-cyan-600 text-gray-300'>Step - 1</h1>}
                        {formNum == 'form2' && <motion.div
                            key={'form2'}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="md:bg-[#0c0b0c] md:shadow-2xl p-8 rounded-lg md:border border-gray-900 w-full lg:mr-20 max-w-[450px] max-h-[600px]">
                            <h1 className='text-cyan-500 text-4xl mb-4 font-hadayat lg:hidden text-center ' >Saair</h1>
                            <h2 className="text-2xl font-bold text-center lg:block hidden text-gray-300 mb-6">Trouble logging in?</h2>
                            <h1 className="text-center mt-6 text-gray-500">Enter your email and we'll send you a link to get back into your account.</h1>

                            <form onSubmit={forgetFormHandler} className="space-y-6 mt-5">

                                <div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder='Email'
                                        name='email'
                                        autoComplete='email'
                                        value={Forgetformdata.email}
                                        onChange={(e) => setForgetformdata({ email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-md border bg-black border-transparent focus:border-cyan-400 focus:bg-black focus:outline-none focus:border font-semibold text-sm placeholder:text-gray-500 text-gray-300 transition-all duration-200 shadow-sm active:shadow-lg active:border-cyan-400 hover:border-cyan-400 hover:bg-black "
                                    />
                                </div>

                                <div className="btn">

                                    <button
                                        type="submit"
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-1 px-4 rounded-md transition duration-200 h-9 font-saira hover:shadow-md shadow-gray-900"
                                    >
                                        Send Reset Link
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-6 text-gray-500">
                                Go Back ?{" "}
                                <Link onClick={() => setformNum('form1')} className="text-cyan-500 hover:underline">
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )}
    </AnimatePresence></>)
}

export default Login
