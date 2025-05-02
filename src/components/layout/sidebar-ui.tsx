import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  MapPin,
  UserCircle,
  Bell,
  Newspaper,
  UserPlus,
  Handshake,
  FileText,
  Search,
  Briefcase,
  Users2,
  Link as LinkIcon,
  Mail,
  Scroll,
  ClipboardCheck,
  UsersRound,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const Sidebar = ({collapsed, setCollapsed}:{collapsed: boolean, setCollapsed: (value: boolean) => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  //const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('/dashboard');
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
    setActiveItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Set initial state based on screen size
    handleResize();

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Home size={20} />, label: 'Property', path: '/property', 
      submenu: [
        { label: 'Property list', path: '/property/list' },
        { label: 'Add property', path: '/property/add' },
        { label: 'Property management', path: '/property/management' },
      ] 
    },
    { icon: <Users size={20} />, label: 'Customer', path: '/customer',
      submenu: [
        { label: 'Customers list', path: '/customer/list' },
      ] 
    },
    { icon: <MessageSquare size={20} />, label: 'Testimonials', path: '/testimonials',
      submenu: [
        { label: 'All testimonials', path: '/reviews' },
      ] 
    },
    { icon: <MapPin size={20} />, label: 'Region', path: '/region',
      submenu: [
        { label: 'Region list', path: '/region/list' },
      ] 
    },
    { icon: <UserCircle size={20} />, label: 'Users', path: '/users',
      submenu: [
        { label: 'Users list', path: '/users/list' },
        { label: 'User profile', path: '/users/profile' },
      ] 
    },
    { icon: <Bell size={20} />, label: 'Notification', path: '/notification',
      submenu: [
        { label: 'All notification', path: '/notification/all' },
      ],
      badge: 27
    },
    { icon: <Newspaper size={20} />, label: 'Advertising', path: '/advertising',
      submenu: [
        { label: 'Advertisings list', path: '/advertising/list' },
      ] 
    },
    { icon: <UserPlus size={20} />, label: 'Subscriber', path: '/subscriber',
      submenu: [
        { label: 'Subscribers list', path: '/subscriber/list' },
      ] 
    },
    { icon: <Handshake size={20} />, label: 'Partner', path: '/partner',
      submenu: [
        { label: 'Associate Partner list', path: '/partner/associate-list' },
        { label: 'Sell Property list', path: '/partner/individual' },
      ] 
    },
    { icon: <FileText size={20} />, label: 'Blog/News', path: '/blog',
      submenu: [
        { label: 'Blog list', path: '/blog/list' },
        { label: 'Create blog', path: '/blog/create' },
      ] 
    },
    { icon: <Search size={20} />, label: 'Property request', path: '/property-request',
      submenu: [
        { label: 'Property request list', path: '/property-request/list' },
      ] 
    },
    { icon: <Briefcase size={20} />, label: 'Career', path: '/career',
      submenu: [
        { label: 'Career/Job list', path: '/career/list' },
        { label: 'Add job', path: '/career/add' },
      ] 
    },
    { icon: <Users2 size={20} />, label: 'Refer and Earn', path: '/refer',
      submenu: [
        { label: 'Refer and earn list', path: '/refer/list' },
      ] 
    },
    { icon: <LinkIcon size={20} />, label: 'Join us', path: '/join',
      submenu: [
        { label: 'Join us list', path: '/join/list' },
      ] 
    },
    { icon: <Mail size={20} />, label: 'Contact us', path: '/contact',
      submenu: [
        { label: 'Contact us list', path: '/contact/list' },
      ] 
    },
    { icon: <Scroll size={20} />, label: 'Subscription', path: '/subscription',
      submenu: [
        { label: 'Subscription list', path: '/subscription/list' },
      ] 
    },
    { icon: <ClipboardCheck size={20} />, label: 'Inspection booking', path: '/inspection',
      submenu: [
        { label: 'Inspection booking list', path: '/inspection/list' },
      ] 
    },
    { icon: <UsersRound size={20} />, label: 'Employee management', path: '/employee',
      submenu: [
        { label: 'Employee management', path: '/employee/management' },
      ] 
    },
  ];

  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
  
  const toggleExpand = (path: string) => {
    setExpandedItems({
      ...expandedItems,
      [path]: !expandedItems[path]
    });
  };

  const handleItemClick = (path: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      toggleExpand(path);
    } else {
      navigate(path);
      setActiveItem(path);
    }
  };

  const Logo = () => (
    <div className={`flex items-center px-4 py-2 ${collapsed ? 'justify-center' : ''}`}>
    
          {!collapsed ? (
            <div className='px-5'>
            <img src="https://res.cloudinary.com/dv0mdoa6b/image/upload/v1741266763/Logo_1_t8y9ap.svg" alt="Paragóne Signature" className="h-12 mx-auto mb-4" />
            </div>
          ) : (
            <div>
            <img src="https://res.cloudinary.com/dv0mdoa6b/image/upload/v1745559595/Logo_1_kmog11.png" alt="Paragóne Signature" className="h-12 mx-auto mb-4 object-cover" />
            </div>
          )}
       
    </div>
  );

  const Footer = () => (
    <div className="mt-auto">
      {!collapsed && (
        <div className="bg-blue-600 text-white p-4 text-sm mx-4 mb-4 rounded-lg">
          Various versions have evolved over the years, sometimes by accident, sometimes on purpose.
        </div>
      )}
      {!collapsed && (
        <div className="px-4 pb-4 text-xs text-gray-600">
          <div>Paragone Signature Dashboard</div>
          <div>© 2025 All Rights Reserved</div>
        </div>
      )}
    </div>
  );

  // Create tooltip component for collapsed mode
  const Tooltip: React.FC<{ children: React.ReactNode; text: string }> = ({ children, text }) => {
    return (
      <div className="relative group">
        {children}
        <div className="absolute left-full ml-2 top-0 transform -translate-y-1/4 w-auto px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
          {text}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-5 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50  z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out overflow-y-auto
        ${isOpen ? (collapsed ? 'w-20' : 'w-64') : '-translate-x-full w-0 lg:translate-x-0'}
        ${collapsed ? 'lg:w-24' : 'lg:w-64'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between">
            <Logo />
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 my-2 -ml-2 rounded-md hover:bg-gray-100 lg:flex hidden"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
          
          <div className="flex-1 overflow-x-hidden overflow-y-auto pt-2">
            <ul>
              {menuItems.map((item) => (
                <li key={item.path} className="mb-1">
                  {collapsed ? (
                    <Tooltip text={item.label}>
                      <div 
                        className={`
                          flex items-center justify-center px-4 py-2 cursor-pointer
                          ${activeItem === item.path || activeItem.startsWith(item.path + '/') ? 'bg-primary text-white' : 'hover:bg-gray-100'}
                        `}
                        onClick={() => handleItemClick(item.path, !!item.submenu)}
                      >
                        <span className={`${activeItem === item.path || activeItem.startsWith(item.path + '/') ? 'text-white' : 'text-gray-500'}`}>
                          {item.icon}
                        </span>
                        {item.badge && (
                          <span className="absolute top-0 right-0 bg-primary text-white text-xs px-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Tooltip>
                  ) : (
                    <>
                      <div 
                        className={`
                          flex items-center justify-between px-4 py-2 cursor-pointer
                          ${activeItem === item.path || activeItem.startsWith(item.path + '/') ? 'bg-primary text-white' : 'hover:bg-gray-100'}
                        `}
                        onClick={() => handleItemClick(item.path, !!item.submenu)}
                      >
                        <div className="flex items-center">
                          <span className={`${activeItem === item.path || activeItem.startsWith(item.path + '/') ? 'text-white' : 'text-gray-500'}`}>
                            {item.icon}
                          </span>
                          <span className="ml-3 text-sm font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center">
                          {item.badge && (
                            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full mr-2">
                              {item.badge}
                            </span>
                          )}
                          {item.submenu && (
                            <span className="text-gray-500">
                              {expandedItems[item.path] ? 
                                <ChevronDown size={16} /> : 
                                <ChevronRight size={16} />
                              }
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {item.submenu && expandedItems[item.path] && (
                        <ul className="pl-10 bg-gray-50">
                          {item.submenu.map((subitem) => (
                            <li key={subitem.path}>
                              <Link 
                                to={subitem.path}
                                className={`
                                  block py-2 text-sm cursor-pointer
                                  ${activeItem === subitem.path ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'}
                                `}
                                onClick={() => setActiveItem(subitem.path)}
                              >
                                {subitem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Sidebar;