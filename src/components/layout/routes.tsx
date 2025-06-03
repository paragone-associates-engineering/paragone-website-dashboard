import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "@/pages/dashboard"
import InspectionBookings from "@/pages/inspect-bookings"
import UserProfile from "@/pages/users/profile"
import EmployeeManagement from "@/pages/employee-management"
import Subscriptions from "@/pages/subscriptions"
import PartnerList from "@/pages/partner/partner-list"
import NotFound from "@/pages/not-found"
import NotificationPage from "@/pages/notifications"
import CustomerList from "@/pages/customers/list"
import PropertyListing from "@/pages/property/property-list"
import CustomersGrid from "@/pages/customers"
import ReferAndEarn from "@/pages/refer-and-earn"
import JoinUs from "@/pages/join-us"
import Login from "@/pages/auth/login"
import RegionPage from "@/pages/region"
import BlogPage from "@/pages/blog"
import EditBlogPage from "@/pages/blog/edit"
import CareerPage from "@/pages/career"
import AddJobPage from "@/pages/career/add"
import EditJobPage from "@/pages/career/edit"
import PartnerWithUsPage from "@/pages/partner/type"
import AddPropertyPage from "@/pages/property/add"
import CreateBlog from "@/pages/blog/create"
import UserManagementPage from "@/pages/users/management"
import AdvertisingPage from "@/pages/advertising"
import ContactUsListPage from "@/pages/contact-list"
import PropertyDetailPage from "@/pages/property/details"
import EditPropertyPage from "@/pages/property/edit"
import PropertyManagementPage from "@/pages/property/management"
import Subscribers from "@/pages/subscibers"
import PropertyRequestPage from "@/pages/property/request"
import ReviewsPage from "@/pages/reviews"
import UnauthorizedPage from "@/pages/auth/unauthorized"
import ProtectedRoute from "@/components/layout/protected-routes"

const AppRoutes = () => {
  
  return (
    <Routes>
    <Route path="/login" element={<Login />} />
     <Route path="/unauthorized" element={<UnauthorizedPage />} />
     <Route element={<ProtectedRoute />}>
     <Route path="/" element={<Dashboard />} />
    <Route path="/inspection-bookings" element={<InspectionBookings />} />
    <Route path="/inspection/list" element={<InspectionBookings />} />
    <Route path="/users/profile" element={<UserProfile />} />
    <Route path="/employee-management" element={<EmployeeManagement />} />
    <Route path="/employee/management" element={<EmployeeManagement />} />
    <Route path="/subscription" element={<Subscriptions />} />
    <Route path="/subscription/list" element={<Subscriptions />} />
    <Route path="/partner" element={<PartnerList />} />
    <Route path="/partner/associate-list" element={<PartnerList />} />
    <Route path="/property" element={<PropertyListing />} />
      <Route path="/property/list" element={<PropertyListing />} />
      <Route path="/property/detail/:id" element={<PropertyDetailPage />} />
      <Route path="/property/edit/:id" element={<EditPropertyPage />} />
      <Route path="/property/management" element={<PropertyManagementPage />} />
      <Route path="/property-request/list" element={<PropertyRequestPage />} />
      <Route path="/property/add" element={<AddPropertyPage />} />
      <Route path="/customer/list" element={<CustomersGrid />} />
      <Route path="/customer/list" element={<CustomerList />} />
      <Route path="/refer/list" element={<ReferAndEarn />} />
      <Route path="/region/list" element={<RegionPage />} />
      <Route path="/join/list" element={<JoinUs />} />
      <Route path="/notification/all" element={<NotificationPage />} />
      <Route path="/blog/list" element={<BlogPage />} />
      <Route path="/blog/create" element={<CreateBlog />} />
      <Route path="/blog/edit/:id" element={<EditBlogPage />} />
      <Route path="/career/list" element={<CareerPage />} />
      <Route path="/career/add" element={<AddJobPage />} />
       <Route path="/career/edit/:id" element={<EditJobPage />} />
      <Route path="/partner/individual" element={<PartnerWithUsPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/users" element={<UserManagementPage />} />
      <Route path="/users/list" element={<UserManagementPage />} />
      <Route path="/advertising/list" element={<AdvertisingPage />} />
      <Route path="/contact/list" element={<ContactUsListPage />} />
      <Route path="/subscriber/list" element={<Subscribers />} />
 </Route>

    {/* Redirect paths */}
    <Route path="/dashboard" element={<Navigate to="/" replace />} />

    {/* Catch all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
  )
}

export default AppRoutes
