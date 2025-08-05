import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router';
import axiosinstance from '@/axios/axios';
import { useDispatch, useSelector } from 'react-redux';
import { getallproducts } from 'Redux/features/product';
import ReactMarkDown from 'react-markdown'
import { GetOneUser } from 'Redux/features/auth';
import Navbar2 from 'Components/Navbar2';

const AIChat = () => {
    const domain = window.location.origin
    //console.log(domain)

    const dispatch = useDispatch()
    const { products, loading } = useSelector((state) => state.product);
    const { error } = useSelector((state) => state?.product);
    const id = localStorage.getItem('id');
    const user = useSelector((state) => state.auth.user);
    if (error) {
        //console.log(error)
    }

    useEffect(() => {
        dispatch(getallproducts());
        if (id) {
            dispatch(GetOneUser(id));
        }
    }, [dispatch]);

    //console.log(products)


    const productContext = {
        "store": {
            'owner': 'Muhammad Rabee',
            'Info of Owner': 'He is A MERN Stack developer ,He developed this site and Many more and also WEb & a little Graphic Designer,Video and Photo Editor,',
            'owners insta about Designs he make': 'https://www.instagram.com/2x.designers/',
            'Current state of wesite': 'Under Working and building',
            'Owner"s whatsapp': '+92 309 4053841 , if someone ask,make a link to direct whatsapp message',
            'Thanks to':'Thanks to Rabee,and Abdul ahad,a Friend of Rabee who gave this AI assistant to Rabee',
            "name": "Saair",
            "tagline": "Companion of a Traveler",
            "domain": `${domain}`,
            "contact_email": "rabijamil8@gmail.com",
            "support_info": {
                "warranty": "All watches include a 2-month warranty against manufacturing defects.",
                "returns": "Items can be returned within 3 days if unused and in original packaging.",
                "delivery": "shipping across Pakistan,Fee:200Rs . Estimated time: 2-4 working days.",
                "payment_methods": ["Cash on Delivery", "Easypaisa And Card (Coming Soon)"]
            },
            'user': user ? [JSON.stringify(user)] : 'User is not logged in'

            ,

            'products': [`${JSON.stringify(products)}`],
            "links": {
                "home": `${domain}`,
                "signup": `${domain}/Signup`,
                "login": `${domain}/Login`,
                "reset_password": `${domain}/Reset/:Token`,
                "shop": `${domain}/Shop`,
                "shop_search": `${domain}/:initialSearchTerm`,
                "contact": `${domain}/Contact-Us`,
                "about": `${domain}/About`,
                "ai_assistant": `${domain}/AI`,
                "cart": `${domain}/Cart`,
                "checkout": `${domain}/Checkout`,
                "product_detail": `${domain}/Product/:id`,
                "order_confirmation": `${domain}/Order-confirmation/:id`
            },
            "navigation": {
                "primary": [
                    { "title": "Home", "url": `${domain}/` },
                    { "title": "Shop", "url": `${domain}/Shop` },
                    { "title": "About Us", "url": `${domain}/About` },
                    { "title": "Contact Us", "url": `${domain}/Contact-Us` },
                    { "title": "Cart", "url": `${domain}/Cart` },
                    { "title": "Checkout", "url": `${domain}/Checkout` }
                ],
                "user": [
                    { "title": "Signup", "url": `${domain}/Signup` },
                    { "title": "Login", "url": `${domain}/Login` },
                    { "title": "Reset Password", "url": `${domain}/Reset/:Token` }
                ]
            },
            "faq": [
                {
                    "question": "How long does delivery take?",
                    "answer": "2 to 4 working days within Pakistan."
                },
                {
                    "question": "What is the return policy?",
                    "answer": "You can return the watch within 3 days of delivery if it is unused and in original packaging."
                },
                {
                    "question": "Is there a warranty?",
                    "answer": "Yes, every watch comes with a 2-month warranty against manufacturing defects."
                },
                {
                    "question": "Can I pay online?",
                    "answer": "Currently, we offer Cash on Delivery Only, Easypaisa,Bank Transfer and Card payments coming soon."
                },
                {
                    "question": "Where can I ask for help?",
                    "answer": `Use our [Contact Us page](${domain}/Contact-Us) or speak to the [AI Assistant](${domain}/AI).`
                }, {
                    'question': 'What does Saair offer?',
                    'answer': 'Saair offers a premium collection of watches crafted for modern travelers — blending simplicity, elegance, and luxury into every design.'
                },
                {
                    'question': 'Do you offer watches for kids?',
                    'answer': 'Our watches are designed for youth and adults aged 16 and above. They feature a clean, aesthetic look that fits both casual and formal wear.'
                },
                {
                    'question': 'Do you offer delivery to foreign countries?',
                    'answer': 'At the moment, Saair delivers only within Pakistan. We’re working to expand our reach soon.'
                },
                {
                    'question': 'How is the delivery process?',
                    'answer': 'Once you place your order, our team quickly processes and ships it to your doorstep anywhere in Pakistan with proper tracking and updates.'
                }
            ]
        }
    }

    //console.log(productContext)

    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hello! I am Saair AI, your personal assistant. How can I help you today?' },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedMessage = inputMessage.trim();
        //console.log(trimmedMessage)
        if (trimmedMessage === '') return;

        const newUserMessage = { sender: 'user', text: trimmedMessage, host: domain };
        setMessages((prev) => [...prev, newUserMessage]);
        setInputMessage('');
        setIsTyping(true);
        const msg = [{
            'role': 'system',
            'content': `You are Saair's product assistant. Use the following info:\n${JSON.stringify(productContext)}`
        },
        {
            'role': 'user',
            'content': trimmedMessage
        }]
        try {
            const response = await axiosinstance.post('/deepseek-chat', {
                prompt: msg
            });

            if (!response || !response.data || !response.data.message) {
                throw new Error('Invalid response from server.');
            }

            const newAiMessage = { sender: 'ai', text: response.data.message };
            setMessages((prev) => [...prev, newAiMessage]);
        } catch (error) {
            //console.error('API call failed:', error);
            const errorText = error?.response?.data?.error || error.message || 'Something went wrong.';
            setMessages((prev) => [...prev, { sender: 'ai', text: `Error: ${errorText}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="max-h-screen min-h-screen bg-[#080708] text-white flex flex-col pt-16">
            <Navbar2 />
            <div className=" w-full mx-auto flex-grow flex flex-col bg-[#0E0E0E]  shadow-lg  transition-colors duration-300 overflow-hidden">

                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 bg-[#151515] border-b border-[#383838] sticky top-0 z-10">
                    <div className="flex items-center">
                        <div className="h-10 w-10 bg-cyan-400 rounded-full flex items-center justify-center font-bold font-saira text-xl text-black mr-4 flex-shrink-0">
                            AI
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-cyan-400 font-saira">Saair AI Assistant</h2>
                            <p className="text-sm text-gray-400">{isTyping ? 'Typing...' : 'Online'}</p>
                        </div>
                    </div>
                    <Link to={-1} className="text-gray-400 hover:text-white transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Link>
                </div>

                {/* Chat Messages */}
                <div className="flex-grow p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] px-4 py-3 rounded-2xl break-words
                                    ${msg.sender === 'user'
                                    ? 'bg-cyan-900/30 text-white rounded-br-none'
                                    : 'bg-[#191919] text-gray-200 rounded-bl-none'
                                }`
                            }>

                                <ReactMarkDown
                                    components={{
                                        a: ({ node, ...props }) => (
                                            <a className="text-cyan-400 underline font-saira" target="_blank" {...props} />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul className="list-disc ml-6" {...props} />
                                        )
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkDown>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-[#191919] text-gray-400 px-4 py-3 rounded-2xl rounded-bl-none max-w-[75%] animate-pulse">
                                Typing<span className="dot-animation-1">.</span><span className="dot-animation-2">.</span><span className="dot-animation-3">.</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-[#151515] border-t border-[#383838] sticky bottom-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            className="flex-grow p-3 bg-[#080708] border border-[#383838] rounded-xl text-white resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-gray-500 transition-colors duration-200"
                            placeholder="Type a message..."
                            rows="1"
                            disabled={isTyping}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className="p-3 bg-cyan-600 rounded-full text-white hover:bg-cyan-700 transition-colors duration-200 flex-shrink-0 disabled:bg-gray-700 disabled:cursor-not-allowed"
                            aria-label="Send message"
                            disabled={isTyping || inputMessage.trim() === ''}
                        >
                            <PaperAirplaneIcon className="h-6 w-6 transform rotate- -mt-0 -mr-1" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
