import { Link } from "react-router";
import {
    Squares2X2Icon, BriefcaseIcon, CubeIcon, LightBulbIcon, RssIcon,
    RectangleStackIcon, DocumentTextIcon, CurrencyDollarIcon, ShoppingCartIcon
} from '@heroicons/react/24/outline'; // Import all potential icons

const getIconComponent = (type) => {
    switch (type) {
        case 'dashboard': return Squares2X2Icon;
        case 'overview': return BriefcaseIcon;
        case 'upload-product': return CubeIcon;
        case 'manage-products': return LightBulbIcon;
        case 'orders': return ShoppingCartIcon; // Changed to ShoppingCartIcon
        case 'sales': return CurrencyDollarIcon; // Changed to CurrencyDollarIcon
        case 'forms': return DocumentTextIcon; // Changed to DocumentTextIcon
        default: return Squares2X2Icon; // Fallback icon
    }
};

const SidebarLink = ({ link, active, isCollapsed, notificationCount }) => {
    const Icon = getIconComponent(link.type); // Dynamically select icon

    return (
        <Link
            to={link.href || '#'}
            className={`
                flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md
                transition-colors duration-300
                ${active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}
                ${isCollapsed ? 'lg:justify-center' : ''}
            `}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className={`
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'max-w-0 opacity-0 hidden' : 'max-w-full opacity-100'}
            `}>
                {link.text}
            </span>
            {notificationCount > 0 && (
                <span className={`
                    ml-auto px-2 py-0.5 rounded-full text-xs font-semibold
                    bg-cyan-600 text-white flex-shrink-0
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'hidden' : 'flex'}
                `}>
                    {notificationCount}
                </span>
            )}
        </Link>
    );
};

export default SidebarLink;