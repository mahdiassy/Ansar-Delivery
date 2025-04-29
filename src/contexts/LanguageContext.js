import React, { createContext, useState, useEffect, useContext } from 'react';

// Create language context
export const LanguageContext = createContext();

// Available languages
export const languages = {
  ar: 'العربية',
  en: 'English'
};

// Translations object
const translations = {
  en: {
    // App name
    appName: 'Delivery Ansar',
    
    // Navigation
    dashboard: 'Dashboard',
    requests: 'Requests',
    messages: 'Messages',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    address: 'Address',
    
    // Service types
    trafficJam: 'Traffic Jam',
    taxiService: 'Taxi service',
    delivery: 'Delivery',
    packageDelivery: 'Package delivery',
    
    // Request form
    createNewRequest: 'Create New Request',
    whatServiceDoYouNeed: 'What service do you need?',
    locationDetails: 'Location Details',
    destination: 'Destination',
    enterYourDestination: 'Enter your destination',
    additionalNotes: 'Additional Notes',
    anyAdditionalDetails: 'Any additional details...',
    cancel: 'Cancel',
    creating: 'Creating...',
    createRequest: 'Create Request',
    
    // Messages
    requestCreatedSuccess: 'Your {service} request has been created successfully!',
    selectServiceType: 'Please select a service type',
    enterDestination: 'Please enter your destination',
    requestCreateFailed: 'Failed to create request. Please try again.',
    
    // Image upload
    uploadImage: 'Upload Image',
    dragAndDrop: 'Drag and drop an image here, or click to select',
    uploadingImage: 'Uploading image...',
    imageUploaded: 'Image uploaded successfully',
    imageUploadFailed: 'Failed to upload image. Please try again.',
    
    // General
    loading: 'Loading...',
    noResults: 'No results found',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    footerCopyright: '© {year} Delivery Ansar. All rights reserved.',
    
    // User Dashboard
    myRequests: 'My Requests',
    newRequest: 'New Request',
    refreshRequests: 'Refresh requests',
    loadingRequests: 'Loading your requests...',
    pendingRequests: 'Pending Requests',
    activeRequests: 'Active Requests',
    completedRequests: 'Completed Requests',
    viewAllCompleted: 'View All Completed Requests',
    noRequestsYet: 'No Requests Yet',
    noRequestsDesc: "You haven't made any requests yet. Create a new request to get started.",
    chatWith: 'Chat with {name}',
    
    // Footer
    madeWith: 'Made with',
    inSaudiArabia: 'in Saudi Arabia',
    
    // Worker directory
    ourServiceProviders: 'Our Service Providers',
    searchWorkers: 'Search workers...',
    
    // Worker roles
    'Taxi Driver': 'Taxi Driver',
    'Delivery Worker': 'Delivery Worker',
  },
  ar: {
    // App name
    appName: 'ديليفري أنصار',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    requests: 'الطلبات',
    messages: 'الرسائل',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    
    // Auth
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    address: 'العنوان',
    
    // Service types
    trafficJam: 'الازدحام المروري',
    taxiService: 'خدمة سيارات الأجرة',
    delivery: 'توصيل',
    packageDelivery: 'توصيل الطرود',
    
    // Request form
    createNewRequest: 'إنشاء طلب جديد',
    whatServiceDoYouNeed: 'ما هي الخدمة التي تحتاجها؟',
    locationDetails: 'تفاصيل الموقع',
    destination: 'الوجهة',
    enterYourDestination: 'أدخل وجهتك',
    additionalNotes: 'ملاحظات إضافية',
    anyAdditionalDetails: 'أي تفاصيل إضافية...',
    cancel: 'إلغاء',
    creating: 'جاري الإنشاء...',
    createRequest: 'إنشاء طلب',
    
    // Messages
    requestCreatedSuccess: 'تم إنشاء طلب {service} بنجاح!',
    selectServiceType: 'الرجاء اختيار نوع الخدمة',
    enterDestination: 'الرجاء إدخال وجهتك',
    requestCreateFailed: 'فشل إنشاء الطلب. يرجى المحاولة مرة أخرى.',
    
    // Image upload
    uploadImage: 'تحميل صورة',
    dragAndDrop: 'اسحب وأفلت صورة هنا، أو انقر للاختيار',
    uploadingImage: 'جاري تحميل الصورة...',
    imageUploaded: 'تم تحميل الصورة بنجاح',
    imageUploadFailed: 'فشل تحميل الصورة. يرجى المحاولة مرة أخرى.',
    
    // General
    loading: 'جاري التحميل...',
    noResults: 'لم يتم العثور على نتائج',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    confirm: 'تأكيد',
    
    // Status
    pending: 'معلق',
    accepted: 'مقبول',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    'Traffic Jam': 'الازدحام المروري',
    'Delivery': 'توصيل',
    destination: 'الوجهة',
    distance: 'المسافة',
    notes: 'ملاحظات',
    user: 'المستخدم',
    phone: 'الهاتف',
    worker: 'العامل',
    'Worker Phone': 'هاتف العامل',
    'just now': 'الآن',
    'minute ago': 'دقيقة مضت',
    'minutes ago': 'دقائق مضت',
    'hour ago': 'ساعة مضت',
    'hours ago': 'ساعات مضت',
    'day ago': 'يوم مضى',
    'days ago': 'أيام مضت',
    'new message': 'رسالة جديدة',
    'new messages': 'رسائل جديدة',
    
    // Actions
    cancel: 'إلغاء',
    chat: 'محادثة',
    accept: 'قبول',
    complete: 'إكمال',
    
    // User dashboard
    myRequests: 'طلباتي',
    newRequest: 'طلب جديد',
    refreshRequests: 'تحديث الطلبات',
    loadingRequests: 'جاري تحميل طلباتك...',
    pendingRequests: 'الطلبات المعلقة',
    activeRequests: 'الطلبات النشطة',
    completedRequests: 'الطلبات المكتملة',
    viewAllCompleted: 'عرض جميع الطلبات المكتملة',
    noRequestsYet: 'لا توجد طلبات حتى الآن',
    noRequestsDesc: 'لم تقم بإنشاء أي طلبات حتى الآن. قم بإنشاء طلب جديد للبدء.',
    chatWith: 'محادثة مع {name}',
    
    // Footer
    footerCopyright: '© {year} ديليفري أنصار. جميع الحقوق محفوظة.',
    madeWith: 'صنع بـ',
    inSaudiArabia: 'في المملكة العربية السعودية',
    
    // Worker directory
    ourServiceProviders: 'مزودي الخدمة لدينا',
    searchWorkers: 'البحث عن العاملين...',
    
    // Worker roles
    'Taxi Driver': 'سائق سيارة أجرة',
    'Delivery Worker': 'عامل توصيل',
  }
};

export const LanguageProvider = ({ children }) => {
  // Default to Arabic
  const [language, setLanguage] = useState('ar');
  
  // Load saved language preference from localStorage on initial load
  useEffect(() => {
    // Always default to Arabic if no language is set
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(savedLanguage);
    
    // Set HTML dir attribute for RTL support
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    
    // Add language class to body for CSS targeting
    document.body.className = savedLanguage === 'ar' ? 'lang-ar' : 'lang-en';
    
    // Set lang attribute on html element
    document.documentElement.lang = savedLanguage;
  }, []);
  
  // Function to change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    // Update language class on body
    document.body.className = lang === 'ar' ? 'lang-ar' : 'lang-en';
    // Update lang attribute on html element
    document.documentElement.lang = lang;
  };
  
  // Translate function
  const t = (key, params = {}) => {
    const translation = translations[language][key] || key;
    
    // Replace parameters in translation string
    if (Object.keys(params).length) {
      return Object.keys(params).reduce((str, param) => {
        return str.replace(`{${param}}`, params[param]);
      }, translation);
    }
    
    return translation;
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext); 