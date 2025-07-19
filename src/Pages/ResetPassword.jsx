import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Navbar2 from '../Components/Navbar2'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { resetPassword } from '../Redux/features/auth'

const ResetPassword = () => {
    const { Token } = useParams('')
    const dispatch = useDispatch()
    const [formdata, setformdata] = useState({ newpassword: '' })
    const navigate = useNavigate()

    useEffect(() => {
        setformdata((formdata) => ({ ...formdata, Token: Token }))
    }, [Token])
    const ResetHandler = async (e) => {
        e.preventDefault();
        // console.log(formdata)
        try {
            const response = await dispatch(resetPassword(formdata))
            // console.log(response)
            if (resetPassword.fulfilled.match(response)) {
                toast.success(response?.payload?.message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
            }
            else {
                toast.error(response?.payload)
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "An unexpected error occurred.")
        }
        //    await axiosinstance.post(`/Reset-Password`,formdata)
        //    .then((res) => {
        //        toast.success(res.data.message)
        //     setTimeout(() => {
        //         navigate('/login')
        //     }, 1000);
        // })
        //    .catch((err) => {
        //         toast.error(err.response.data.message)
        //         console.log(err)
        //     })
        //     console.log(formdata)
        //     // setPassword('')
    }
    return (
        <AnimatePresence mode='sync'>
            <Navbar2 />
            <div key={'1122'} className='  bg-[#080708]'>
                <div className="min-h-screen flex flex-row items-center justify-center lg:container md:px-5 mx-auto ">
                    <ArrowLeftIcon onClick={() => { navigate('/login') }} className='absolute size-4 lg:size-5 lg:left-10 lg:top-20 left-7  hover:text-cyan-600 top-17 text-gray-300' />
                    <h1 className='absolute min-w-max lg:size-5 lg:right-10 lg:top-17 right-7 top-15 text-gray-300 hover:text-cyan-600'>Step - 2</h1>
                    <div className="text mx-5 w-full hidden lg:flex flex-col">
                        <h1 className='text-cyan-400 text-8xl -mb-1 font-hadayat  ' >Saair</h1>
                        <h2 className='text-3xl text-gray-300 -ml-4  font-saira  font-semibold'>Companion of a Traveler</h2>
                    </div>
                    <motion.div
                        key={'form32'}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                        className="md:bg-[#141414] md:shadow-2xl p-8 rounded-lg md:border border-gray-900 w-full lg:mr-20 max-w-[450px] max-h-[600px]">
                        <h1 className='text-cyan-400 text-4xl mb-4 font-hadayat lg:hidden text-center ' >Saair</h1>
                        <h2 className="text-2xl font-bold text-center lg:block hidden text-gray-300 mb-6">Create New Password</h2>
                        {/* <h1 className="text-center mt-6 text-gray-500">Enter your email and we'll send you a link to get back into your account.</h1> */}

                        <form onSubmit={ResetHandler} className="space-y-6 mt-5">

                            <div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder='New Password'
                                    name='newpassword'
                                    value={formdata.newpassword}
                                    onChange={(e) => {
                                        setformdata((formdata) => ({ ...formdata, [e.target.name]: e.target.value }))
                                        // console.log(formdata)
                                    }}
                                    required
                                    className="w-full px-4 py-3 rounded-md border bg-black border-transparent focus:border-cyan-400 focus:bg-black focus:outline-none focus:border font-semibold text-sm placeholder:text-gray-500 text-gray-300 transition duration-200 shadow-sm active:shadow-lg active:border-cyan-400 hover:border-cyan-400 hover:bg-black "
                                />
                            </div>

                            <div className="btn">

                                <button
                                    type="submit"
                                    className="w-full bg-cyan-400 hover:bg-cyan-600 text-black  py-1 px-4 rounded-md transition duration-200 h-9 font-saira font-semibold"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-6 text-gray-500">
                            Go Back ?{" "}
                            <Link to={'/Login'} className="text-cyan-400 hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    )
}

export default ResetPassword
