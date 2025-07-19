import { useLocation, useNavigate } from 'react-router';
import SidebarLink from './SidebarLink';
import {
  Squares2X2Icon, BriefcaseIcon, CubeIcon, LightBulbIcon, RssIcon,
  RectangleStackIcon, MagnifyingGlassIcon, SunIcon, ChevronUpDownIcon,
  ChevronDoubleLeftIcon,
  ArrowRightEndOnRectangleIcon,
  DocumentTextIcon, // For Contact Forms
  CurrencyDollarIcon, // For Sales
  ShoppingCartIcon // Another option for Orders if RssIcon isn't preferred
} from '@heroicons/react/24/outline'; // Added new icons
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetOneUser, Logout } from '../../Redux/features/auth';

// Define link types for dynamic icons and potentially notification counts
const mainLinks = [
  { href: '/Dashboard/', icon: Squares2X2Icon, text: 'Dashboard', type: 'dashboard' },
  { href: '/Dashboard/overview', icon: BriefcaseIcon, text: 'Overview', type: 'overview' },
  { href: '/Dashboard/upload-product', icon: CubeIcon, text: 'Upload Product', type: 'upload-product' },
  { href: '/Dashboard/manage-products', icon: LightBulbIcon, text: 'Manage Products', type: 'manage-products' },
  { href: '/Dashboard/orders', icon: RssIcon, text: 'Orders', type: 'orders' }, // RssIcon is fine, but ShoppingCartIcon might be more intuitive
  { href: '/Dashboard/sales', icon: RectangleStackIcon, text: 'Sales', type: 'sales' }, // RectangleStackIcon is okay, but CurrencyDollarIcon might be better
  { href: '/Dashboard/contact-forms', icon: RectangleStackIcon, text: 'Forms', type: 'forms' }, // RectangleStackIcon is fine, but DocumentTextIcon might be better
];

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const id = localStorage.getItem('id');
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const { orders } = useSelector(state => state.order); // Get orders from Redux
  const { contactForms } = useSelector(state => state.contact);
  const pendingForms = contactForms.filter((form) => form.status == 'pending')
  const pendingorders = orders.filter((order) => order.orderStatus == "Pending")

  // New state for notification counts
  const [pendingOrdersCount, setPendingOrdersCount] = useState(pendingorders.length);
  const [pendingFormsCount, setPendingFormsCount] = useState(pendingForms.length);
console.log(pendingOrdersCount)

  useEffect(() => {
    if (id) {
      dispatch(GetOneUser(id));
    }
    // TODO: Fetch notification counts here
    // Example (you'll implement the actual thunks/API calls below):
    // dispatch(getPendingOrdersCount()).then(action => {
    //     if (action.payload) setPendingOrdersCount(action.payload.count);
    // });
    // dispatch(getPendingFormsCount()).then(action => {
    //     if (action.payload) setPendingFormsCount(action.payload.count);
    // });

  }, [id, dispatch]);

  const handleLogout = () => {
    dispatch(Logout());
    navigate('/login');
  };

  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    if (words.length >= 2) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper to get count based on link type
  const getNotificationCount = (type) => {
    switch (type) {
      case 'orders':
        return pendingOrdersCount;
      case 'forms':
        return pendingFormsCount;
      default:
        return null; // No count for other link types
    }
  };

  return (
    <div
      className={`
                bg-[#111111] text-zinc-300 flex flex-col p-4 border-r border-zinc-800
                transition-all duration-300 ease-in-out
                fixed inset-y-0 left-0 top-0 z-30 lg:relative lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} max-h-screen
            `}
    >
      <div className="flex items-center justify-between mb-4">
        {/* Header - User Info */}
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
          <div className={`flex items-center justify-center w-10 h-10 bg-zinc-800 rounded-md font-bold text-white flex-shrink-0`}>
            {getInitials(user?.name)}
          </div>
          {/* Text content with transition for smooth hide/show */}
          <div className={`flex-grow transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-full opacity-100'}`}>
            <p className="font-semibold text-white truncate">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-zinc-400 capitalize truncate">{user?.role || 'User'}</p>
          </div>
          {/* ChevronUpDownIcon always visible but maybe styled differently when collapsed */}
          <ChevronUpDownIcon className={`w-5 h-5 text-zinc-500 flex-shrink-0 ${isCollapsed ? 'lg:hidden' : ''}`} />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-grow mt-4">
        <ul className="space-y-1">
          {/* Collapse Button - Placed inside nav for better flow */}
          <li className="mb-4">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-300"
            >
              <ChevronDoubleLeftIcon
                className={`w-6 h-6 transition-transform duration-300 ease-in-out ${isCollapsed ? 'rotate-180' : ''}`}
              />
              {/* Span for text with smooth transition */}
              <span className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-full opacity-100'}`}>Collapse</span>
            </button>
          </li>
          {mainLinks.map((link) => (
            <li key={link.text}>
              <SidebarLink
                link={link} // Pass the entire link object
                active={pathname === link.href}
                isCollapsed={isCollapsed}
                notificationCount={getNotificationCount(link.type)} // Pass count if available
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className={`space-y-1 mt-4 `}>
        {/* Dark/Light Mode Toggle */}
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-300">
          <SunIcon className="w-5 h-5 flex-shrink-0" />
          <span className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-full opacity-100'}`}>Light</span>
        </button>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-300"
        >
          <ArrowRightEndOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          <span className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-full opacity-100'}`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;