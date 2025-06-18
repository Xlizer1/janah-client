const arTranslations = {
  // Navigation
  "nav.home": "الرئيسية",
  "nav.products": "المنتجات",
  "nav.categories": "الفئات",
  "nav.orders": "طلباتي",
  "nav.about": "حول",
  "nav.contact": "اتصل بنا",
  "nav.login": "تسجيل الدخول",
  "nav.register": "إنشاء حساب",
  "nav.logout": "تسجيل الخروج",
  "nav.profile": "الملف الشخصي",
  "nav.admin": "لوحة الإدارة",
  "nav.cart": "عربة التسوق",

  // Common
  "common.loading": "جاري التحميل...",
  "common.error": "خطأ",
  "common.success": "نجح",
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.delete": "حذف",
  "common.edit": "تعديل",
  "common.add": "إضافة",
  "common.search": "بحث",
  "common.filter": "تصفية",
  "common.sort": "ترتيب حسب",
  "common.price": "السعر",
  "common.name": "الاسم",
  "common.category": "الفئة",
  "common.quantity": "الكمية",
  "common.total": "المجموع",
  "common.subtotal": "المجموع الفرعي",
  "common.back": "رجوع",
  "common.next": "التالي",
  "common.previous": "السابق",
  "common.continue": "متابعة",
  "common.submit": "إرسال",
  "common.clear": "مسح",
  "common.view": "عرض",
  "common.details": "التفاصيل",
  "common.yes": "نعم",
  "common.no": "لا",
  "common.close": "إغلاق",
  "common.refresh": "تحديث",
  "common.download": "تحميل",
  "common.upload": "رفع",
  "common.create": "إنشاء",
  "common.update": "تحديث",
  "common.confirm": "تأكيد",
  "common.remove": "إزالة",
  "common.actions": "الإجراءات",
  "common.status": "الحالة",
  "common.date": "التاريخ",
  "common.address": "العنوان",
  "common.notes": "ملاحظات",
  "common.shipping": "الشحن",
  "common.free": "مجاني",
  "common.tax": "الضريبة",
  "common.included": "مُتضمّن",
  "common.continue.shopping": "متابعة التسوق",

  // Auth
  "auth.login.title": "مرحباً بعودتك",
  "auth.login.subtitle": "سجل دخولك للمتابعة في التسوق",
  "auth.register.title": "إنشاء حساب",
  "auth.register.subtitle": "انضم إلى جنة لبدء تسوق المنتجات الرائعة",
  "auth.phone": "رقم الهاتف",
  "auth.password": "كلمة المرور",
  "auth.confirmPassword": "تأكيد كلمة المرور",
  "auth.firstName": "الاسم الأول",
  "auth.lastName": "اسم العائلة",
  "auth.email": "البريد الإلكتروني",
  "auth.forgotPassword": "نسيت كلمة المرور؟",
  "auth.forgotPassword.title": "نسيت كلمة المرور؟",
  "auth.forgotPassword.subtitle":
    "لا تقلق! أدخل رقم هاتفك وسنرسل لك رمز إعادة التعيين",
  "auth.signIn": "تسجيل الدخول",
  "auth.createAccount": "إنشاء حساب جديد",
  "auth.alreadyHaveAccount": "لديك حساب بالفعل؟",
  "auth.dontHaveAccount": "ليس لديك حساب؟",
  "auth.rememberPassword": "تتذكر كلمة المرور؟",
  "auth.backToLogin": "العودة لتسجيل الدخول",
  "auth.verifyPhone.title": "تحقق من هاتفك",
  "auth.verifyPhone.subtitle":
    "لقد أرسلنا رمز تحقق مكون من 6 أرقام إلى رقم هاتفك",
  "auth.resetPassword.title": "إعادة تعيين كلمة المرور",
  "auth.resetPassword.subtitle": "أدخل رمز التحقق وكلمة المرور الجديدة",
  "auth.resetCode.sent": "تم إرسال رمز الإعادة!",
  "auth.resetCode.sentTo":
    "لقد أرسلنا رمز إعادة التعيين المكون من 6 أرقام إلى رقم هاتفك:",
  "auth.resetCode.checkSMS":
    "يرجى التحقق من رسائل SMS للحصول على رمز التحقق. سينتهي صلاحية الرمز خلال 10 دقائق.",
  "auth.resetPassword.complete": "تم إعادة تعيين كلمة المرور!",
  "auth.resetPassword.success":
    "تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
  "auth.continueToReset": "متابعة إعادة تعيين كلمة المرور",
  "auth.differentPhone": "جرب رقم هاتف مختلف",
  "auth.continueToLogin": "متابعة تسجيل الدخول",
  "auth.sendResetCode": "إرسال رمز الإعادة",
  "auth.sending": "جاري الإرسال...",
  "auth.resetPassword": "إعادة تعيين كلمة المرور",
  "auth.resendCode": "إعادة إرسال الرمز",
  "auth.verifyCode": "تحقق من رقم الهاتف",
  "auth.verifying": "جاري التحقق...",
  "auth.codeExpires": "ينتهي صلاحية الرمز خلال",
  "auth.resendIn": "إعادة إرسال الرمز خلال",
  "auth.didntReceive":
    "لم تستلم الرمز؟ تحقق من رسائل SMS أو جرب إعادة الإرسال.",
  "auth.newPassword": "كلمة المرور الجديدة",
  "auth.currentPassword": "كلمة المرور الحالية",
  "auth.verification.code": "رمز التحقق",
  "auth.resetPassword.message":
    "أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك وأنشئ كلمة مرور جديدة.",
  "auth.infoAlert":
    "المستخدمون الجدد بحاجة لموافقة المشرف قبل الوصول للمنصة. اتصل بالدعم إذا كنت بحاجة للمساعدة.",
  "auth.infoAlert.verification":
    "بعد التحقق من الهاتف، سيكون حسابك في انتظار موافقة المشرف. ستتلقى إشعاراً عند الموافقة.",
  "auth.infoAlert.reset":
    "أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك وأنشئ كلمة مرور جديدة. يجب أن تكون كلمة المرور الجديدة مكونة من 6 أحرف على الأقل.",

  // Products
  "products.title": "المنتجات",
  "products.featured": "المنتجات المميزة",
  "products.addToCart": "أضف للسلة",
  "products.outOfStock": "نفد من المخزون",
  "products.lowStock": "مخزون منخفض",
  "products.inStock": "متوفر",
  "products.viewDetails": "عرض التفاصيل",
  "products.sortBy.newest": "الأحدث أولاً",
  "products.sortBy.oldest": "الأقدم أولاً",
  "products.sortBy.priceAsc": "السعر من الأقل للأعلى",
  "products.sortBy.priceDesc": "السعر من الأعلى للأقل",
  "products.sortBy.nameAsc": "الاسم أ-ي",
  "products.sortBy.nameDesc": "الاسم ي-أ",
  "products.noProducts": "لم يتم العثور على منتجات",
  "products.noProducts.subtitle": "جرب تعديل المرشحات أو مصطلحات البحث",
  "products.productCount": "منتجات متاحة",
  "products.description": "الوصف",
  "products.specifications": "المواصفات",
  "products.reviews": "المراجعات",
  "products.shipping": "الشحن",
  "products.relatedProducts": "منتجات ذات صلة",
  "products.filters": "المرشحات",
  "products.priceRange": "نطاق السعر",
  "products.quickFilters": "مرشحات سريعة",
  "products.allCategories": "جميع الفئات",
  "products.underPrice": "أقل من 50 دولار",
  "products.priceRange.100to500": "100 - 500 دولار",

  // Categories
  "categories.title": "تسوق حسب الفئة",
  "categories.subtitle":
    "استكشف مجموعة واسعة من فئات المنتجات للعثور على ما تبحث عنه بالضبط",
  "categories.viewAll": "عرض جميع الفئات",
  "categories.exploreCategory": "استكشف الفئة",
  "categories.products": "منتجات",
  "categories.noCategories": "لا توجد فئات متاحة في الوقت الحالي.",
  "categories.popularCategories": "الفئات الشائعة",
  "categories.noResults": "لم يتم العثور على فئات",
  "categories.noResults.help":
    "لا توجد فئات تطابق مصطلح البحث. جرب مصطلحات بحث مختلفة.",
  "categories.noCategories.help": "ستظهر الفئات هنا بمجرد إضافتها.",

  // Cart
  "cart.title": "عربة التسوق",
  "cart.empty": "عربة التسوق فارغة",
  "cart.emptySubtitle":
    "يبدو أنك لم تضف أي شيء إلى عربة التسوق بعد. ابدأ التسوق لملئها!",
  "cart.continueShopping": "متابعة التسوق",
  "cart.proceedToCheckout": "المتابعة للدفع",
  "cart.clearCart": "مسح السلة",
  "cart.removeItem": "إزالة العنصر",
  "cart.updateQuantity": "تحديث الكمية",
  "cart.items": "عناصر",
  "cart.orderSummary": "ملخص الطلب",
  "cart.cartItems": "عناصر السلة",
  "cart.browseCategories": "تصفح الفئات",
  "cart.whyShopWithUs": "لماذا تتسوق معنا؟",
  "cart.freeDelivery": "توصيل مجاني",
  "cart.freeDelivery.subtitle": "شحن مجاني داخل بغداد",
  "cart.securePayment": "دفع آمن",
  "cart.securePayment.subtitle": "الدفع عند التسليم متاح",
  "cart.easyReturns": "إرجاع سهل",
  "cart.easyReturns.subtitle": "سياسة إرجاع لمدة 30 يوماً",

  // Checkout
  "checkout.title": "إتمام الطلب",
  "checkout.reviewItems": "مراجعة العناصر",
  "checkout.deliveryInfo": "معلومات التوصيل",
  "checkout.payment": "الدفع",
  "checkout.confirmation": "التأكيد",
  "checkout.deliveryAddress": "عنوان التوصيل",
  "checkout.sellingPrice": "سعر البيع",
  "checkout.sellingPriceP": "سعر البيع",
  "checkout.deliveryNotes": "ملاحظات التوصيل",
  "checkout.paymentMethod": "طريقة الدفع",
  "checkout.cashOnDelivery": "الدفع عند التوصيل",
  "checkout.placeOrder": "إرسال الطلب",
  "checkout.orderPlaced": "تم إرسال الطلب بنجاح!",
  "checkout.orderSuccess": "شكراً لطلبك. رقم طلبك هو:",
  "checkout.orderSuccess.sms": "سنرسل لك إشعار SMS بتحديثات حالة طلبك.",
  "checkout.viewOrders": "عرض الطلبات",
  "checkout.deliveryTo": "التوصيل إلى:",
  "checkout.addressNote": "يرجى تقديم عنوان مفصل يتضمن معالم للتوصيل الدقيق.",
  "checkout.cashOnDeliveryInfo":
    "حالياً، نقبل فقط المدفوعات النقدية عند التسليم. فريق التوصيل سيجمع الدفعة عند وصول طلبك.",
  "checkout.reviewYourOrder":
    "يرجى مراجعة طلبك بعناية. بمجرد الإرسال، يمكنك تتبع حالة طلبك لكن التغييرات قد لا تكون ممكنة.",
  "checkout.placingOrder": "جاري إرسال الطلب...",
  "checkout.orderNumber": "رقم الطلب",
  "checkout.shippingInfo": "توصيل مجاني داخل بغداد",

  // Orders
  "orders.title": "طلباتي",
  "orders.status": "الحالة",
  "orders.orderDate": "تاريخ الطلب",
  "orders.totalAmount": "المبلغ الإجمالي",
  "orders.viewDetails": "عرض التفاصيل",
  "orders.trackOrder": "تتبع الطلب",
  "orders.noOrders": "لم يتم العثور على طلبات",
  "orders.noOrders.subtitle": "لم تقم بأي طلبات بعد",
  "orders.clearFilters": "مسح المرشحات",
  "orders.startShopping": "ابدأ التسوق",
  "orders.allOrders": "جميع الطلبات",
  "orders.activeOnly": "النشطة فقط",
  "orders.inactiveOnly": "غير النشطة فقط",
  "orders.trackOrderTitle": "تتبع الطلب",
  "orders.orderInTransit": "طلبك في الطريق!",
  "orders.orderHasBeenDelivered": "تم تسليم طلبك!",
  "orders.estimatedDelivery": "التسليم المتوقع:",
  "orders.deliveredOn": "تم التسليم في",
  "orders.orderTimeline": "مخطط زمني للطلب",
  "orders.orderSummary": "ملخص الطلب",
  "orders.deliveryInfo": "معلومات التوصيل",
  "orders.needHelp": "تحتاج مساعدة؟",
  "orders.contactSupport": "اتصل بالدعم",
  "orders.trackViaSMS": "تتبع عبر SMS",
  "orders.orderProgress": "تقدم الطلب",
  "orders.orderStatus.pending": "قيد الانتظار",
  "orders.orderStatus.confirmed": "مؤكد",
  "orders.orderStatus.preparing": "قيد التحضير",
  "orders.orderStatus.ready": "جاهز للشحن",
  "orders.orderStatus.shipped": "تم الشحن",
  "orders.orderStatus.delivered": "تم التسليم",
  "orders.orderStatus.cancelled": "ملغى",
  "orders.orderDetails": "تفاصيل الطلب",
  "orders.deliveryAddress": "عنوان التوصيل",
  "orders.importantDates": "تواريخ مهمة",
  "orders.orderPlaced": "تم إرسال الطلب",
  "orders.orderConfirmed": "تم تأكيد الطلب",
  "orders.orderShipped": "تم شحن الطلب",
  "orders.orderDelivered": "تم تسليم الطلب",

  // Hero Section
  "hero.title": "جاهز تبدي؟",
  "hero.subtitle": "إبدأ تثبيت طلبات زبائنك الاَن, وخلي الجناح يهتم بالباقي.",
  "hero.shopNow": "تسوق الآن",
  "hero.viewTrending": "عرض الرائج",
  "hero.rating": "التقييم",
  "hero.reviews": "من المراجعات",
  "hero.happyCustomers": "عملاء راضون",

  // Newsletter
  "newsletter.title": "ابق على اطلاع",
  "newsletter.subtitle":
    "اشترك في نشرتنا الإخبارية وكن أول من يعرف عن المنتجات الجديدة والعروض الحصرية والعروض الخاصة. لا بريد مزعج، فقط محتوى رائع!",
  "newsletter.benefits.1": "🎉 خصومات حصرية ووصول مبكر",
  "newsletter.benefits.2": "📦 إعلانات المنتجات الجديدة",
  "newsletter.benefits.3": "💡 نصائح تقنية وأدلة الشراء",
  "newsletter.benefits.4": "🎁 عروض خاصة للأعضاء فقط",
  "newsletter.joinSubscribers": "انضم إلى أكثر من 10,000 مشترك",
  "newsletter.enterEmail": "أدخل عنوان بريدك الإلكتروني",
  "newsletter.subscribe": "اشترك الآن",
  "newsletter.subscribing": "جاري الاشتراك...",
  "newsletter.privacyNote":
    "بالاشتراك، فإنك توافق على سياسة الخصوصية. إلغاء الاشتراك في أي وقت.",
  "newsletter.thankYou": "شكراً لك!",
  "newsletter.thankYou.message":
    "لقد اشتركت بنجاح في نشرتنا الإخبارية. استعد للعروض المذهلة والتحديثات!",

  // Footer
  "footer.company": "الشركة",
  "footer.products": "المنتجات",
  "footer.support": "الدعم",
  "footer.legal": "قانوني",
  "footer.followUs": "تابعنا",
  "footer.newsletter": "ابق على اطلاع",
  "footer.newsletterSubtitle":
    "اشترك في نشرتنا الإخبارية وكن أول من يعرف عن المنتجات الجديدة والعروض الحصرية والعروض الخاصة.",
  "footer.subscribe": "اشترك الآن",
  "footer.copyright": "جميع الحقوق محفوظة.",
  "footer.madeWith": "صُنع بـ ❤️ في العراق",
  "footer.companyInfo":
    "شريكك الموثوق للإلكترونيات والأجهزة عالية الجودة. نحن نقدم لك أحدث التقنيات بأسعار لا تُقاوم مع خدمة عملاء استثنائية.",
  "footer.contact.phone": "+964 773 300 2076",
  "footer.contact.email": "support@janah.com",
  "footer.contact.location": "بغداد، العراق",
  "footer.links.allProducts": "جميع المنتجات",
  "footer.links.electronics": "الإلكترونيات",
  "footer.links.computers": "أجهزة الكمبيوتر",
  "footer.links.smartphones": "الهواتف الذكية",
  "footer.links.accessories": "الإكسسوارات",
  "footer.links.aboutUs": "من نحن",
  "footer.links.ourStory": "قصتنا",
  "footer.links.careers": "الوظائف",
  "footer.links.press": "الصحافة",
  "footer.links.blog": "المدونة",
  "footer.links.helpCenter": "مركز المساعدة",
  "footer.links.contactUs": "اتصل بنا",
  "footer.links.returns": "الإرجاع",
  "footer.links.shipping": "معلومات الشحن",
  "footer.links.sizeGuide": "دليل المقاسات",
  "footer.links.privacyPolicy": "سياسة الخصوصية",
  "footer.links.terms": "شروط الخدمة",
  "footer.links.cookiePolicy": "سياسة ملفات تعريف الارتباط",
  "footer.links.refundPolicy": "سياسة الاسترداد",
  "footer.links.security": "الأمان",

  // Search
  "search.searchProducts": "البحث عن المنتجات...",
  "search.searching": "جاري البحث...",
  "search.suggestions": "الاقتراحات",
  "search.popularSearches": "عمليات البحث الشائعة",
  "search.noSuggestions": "لم يتم العثور على اقتراحات. جرب هذه البحوث الشائعة:",
  "search.results": "نتائج البحث",
  "search.resultsFor": "نتائج لـ",
  "search.noResults": "لم يتم العثور على نتائج",
  "search.noResults.help":
    "لم نتمكن من العثور على أي شيء لـ. جرب كلمات مفتاحية مختلفة أو تصفح فئاتنا.",
  "search.searchSuggestions": "اقتراحات البحث",
  "search.popularProducts": "المنتجات الشائعة",
  "search.brands": "العلامات التجارية",
  "search.priceRanges": "نطاقات الأسعار",

  // Profile
  "profile.title": "معلومات الملف الشخصي",
  "profile.accountDetails": "تفاصيل الحساب",
  "profile.phoneNumber": "رقم الهاتف",
  "profile.email": "عنوان البريد الإلكتروني",
  "profile.memberSince": "عضو منذ",
  "profile.accountStatus": "حالة الحساب",
  "profile.active": "نشط",
  "profile.pending": "في انتظار الموافقة",
  "profile.verified": "محقق",
  "profile.notVerified": "غير محقق",
  "profile.editProfile": "تعديل الملف الشخصي",
  "profile.changePassword": "تغيير كلمة المرور",
  "profile.logout": "تسجيل الخروج",
  "profile.saveChanges": "حفظ التغييرات",
  "profile.saving": "جاري الحفظ...",
  "profile.accountSettings": "إعدادات الحساب",
  "profile.twoFactor": "المصادقة الثنائية",
  "profile.emailNotifications": "إشعارات البريد الإلكتروني",
  "profile.pendingApproval":
    "حسابك في انتظار موافقة المشرف. قد تكون بعض الميزات محدودة حتى يتم تفعيل حسابك.",
  "profile.phoneCannotChange": "لا يمكن تغيير رقم الهاتف",
  "profile.orders": "الطلبات",
  "profile.noOrders": "لا توجد طلبات بعد",
  "profile.noOrders.subtitle":
    "لم تقم بأي طلبات بعد. ابدأ التسوق لرؤية تاريخ طلباتك هنا.",
  "profile.settings": "الإعدادات",

  // 404 Page
  "404.title": "عذراً! الصفحة غير موجودة",
  "404.subtitle":
    "الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها أو أدخلت رابطاً خاطئاً.",
  "404.goHome": "العودة للرئيسية",
  "404.browseProducts": "تصفح المنتجات",
  "404.tryPopular": "أو جرب هذه الصفحات الشائعة:",

  // Admin - General
  "admin.dashboard": "لوحة تحكم المشرف",
  "admin.products": "المنتجات",
  "admin.categories": "الفئات",
  "admin.users": "المستخدمون",
  "admin.analytics": "التحليلات",
  "admin.settings": "الإعدادات",
  "admin.bulkOperations": "العمليات المجمعة",
  "admin.importExport": "استيراد/تصدير",
  "admin.back": "العودة للمتجر",
  "admin.accessDenied": "تم رفض الوصول",
  "admin.noPermission": "ليس لديك إذن للوصول إلى هذه الصفحة.",

  // Admin Dashboard
  "admin.dashboard.overview": "نظرة عامة على لوحة التحكم",
  "admin.dashboard.totalRevenue": "إجمالي الإيرادات",
  "admin.dashboard.totalOrders": "إجمالي الطلبات",
  "admin.dashboard.productsSold": "المنتجات المباعة",
  "admin.dashboard.conversionRate": "معدل التحويل",
  "admin.dashboard.totalUsers": "إجمالي المستخدمين",
  "admin.dashboard.activeUsers": "المستخدمون النشطون",
  "admin.dashboard.pendingActivation": "في انتظار التفعيل",
  "admin.dashboard.activationRate": "معدل التفعيل",
  "admin.dashboard.unverifiedPhone": "هاتف غير محقق",
  "admin.dashboard.requiresAdminAction": "يتطلب إجراءً من المشرف",
  "admin.dashboard.userActivationSuccess": "نجاح تفعيل المستخدم",
  "admin.dashboard.needPhoneVerification": "بحاجة لتحقق الهاتف",
  "admin.dashboard.topCategories": "أهم الفئات",
  "admin.dashboard.productsNeedingAttention": "منتجات تحتاج انتباه",
  "admin.dashboard.recentActivity": "النشاط الأخير",
  "admin.dashboard.loading": "جاري تحميل لوحة التحكم...",

  // Admin Products
  "admin.products.management": "إدارة المنتجات",
  "admin.products.subtitle": "إدارة كتالوج المنتجات والمخزون والإعدادات",
  "admin.products.addProduct": "إضافة منتج",
  "admin.products.createProduct": "إنشاء منتج جديد",
  "admin.products.editProduct": "تعديل المنتج",
  "admin.products.productDetails": "تفاصيل المنتج",
  "admin.products.export": "تصدير",
  "admin.products.import": "استيراد",
  "admin.products.totalProducts": "إجمالي المنتجات",
  "admin.products.inStock": "متوفر",
  "admin.products.lowStock": "مخزون منخفض",
  "admin.products.featured": "مميز",
  "admin.products.basicInformation": "المعلومات الأساسية",
  "admin.products.productName": "اسم المنتج",
  "admin.products.productCode": "رمز المنتج",
  "admin.products.urlSlug": "رابط URL",
  "admin.products.urlSlugHelp": "نسخة ملائمة للرابط من الاسم (تُنشأ تلقائياً)",
  "admin.products.description": "الوصف",
  "admin.products.descriptionPlaceholder": "اوصف منتجك بالتفصيل...",
  "admin.products.pricingInventory": "التسعير والمخزون",
  "admin.products.price": "السعر",
  "admin.products.stockQuantity": "كمية المخزون",
  "admin.products.sku": "رمز المنتج (SKU)",
  "admin.products.skuHelp": "معرف فريد للمنتج",
  "admin.products.skuPlaceholder": "SKU-12345",
  "admin.products.productDetails.title": "تفاصيل المنتج",
  "admin.products.weight": "الوزن",
  "admin.products.dimensions": "الأبعاد",
  "admin.products.dimensionsPlaceholder": "الطول × العرض × الارتفاع (سم)",
  "admin.products.productImages": "صور المنتج",
  "admin.products.imageUrl": "رابط الصورة",
  "admin.products.imageUrlHelp": "أدخل رابط الصورة أو ارفع أدناه",
  "admin.products.uploadImage": "رفع صورة",
  "admin.products.addImage": "إضافة صورة",
  "admin.products.imagePreview": "معاينة الصورة",
  "admin.products.productStatus": "حالة المنتج",
  "admin.products.productActive": "المنتج نشط",
  "admin.products.featuredProduct": "منتج مميز",
  "admin.products.organization": "التنظيم",
  "admin.products.category": "الفئة",
  "admin.products.noCategory": "بدون فئة",
  "admin.products.quickActions": "إجراءات سريعة",
  "admin.products.updateStock": "تحديث المخزون",
  "admin.products.viewLiveProduct": "عرض المنتج المباشر",
  "admin.products.changeImage": "تغيير الصورة",
  "admin.products.duplicateProduct": "نسخ المنتج",
  "admin.products.productInformation": "معلومات المنتج",
  "admin.products.created": "تم الإنشاء",
  "admin.products.lastUpdated": "آخر تحديث",
  "admin.products.currentStock": "المخزون الحالي",
  "admin.products.dangerZone": "منطقة الخطر",
  "admin.products.deleteProduct": "حذف المنتج",
  "admin.products.deleteWarning":
    "حذف هذا المنتج سيزيله نهائياً من الكتالوج. هذا الإجراء لا يمكن التراجع عنه.",
  "admin.products.backToProducts": "العودة للمنتجات",
  "admin.products.saveChanges": "حفظ التغييرات",
  "admin.products.saving": "جاري الحفظ...",
  "admin.products.creating": "جاري الإنشاء...",
  "admin.products.deleting": "جاري الحذف...",
  "admin.products.unsavedChanges": "لديك تغييرات غير محفوظة",
  "admin.products.viewLive": "عرض مباشر",
  "admin.products.lowStockWarning": "مخزون منخفض! {count} عناصر متبقية فقط.",
  "admin.products.outOfStockWarning": "هذا المنتج نفد من المخزون.",
  "admin.products.inactive": "غير نشط",
  "admin.products.active": "نشط",
  "admin.products.stockUpdateDialog": "تحديث كمية المخزون",
  "admin.products.currentStock.label": "المخزون الحالي",
  "admin.products.newStockQuantity": "كمية المخزون الجديدة",
  "admin.products.updating": "جاري التحديث...",
  "admin.products.updateStock.button": "تحديث المخزون",
  "admin.products.deleteConfirmation": "حذف المنتج",
  "admin.products.deleteConfirmationText": "هذا الإجراء لا يمكن التراجع عنه!",
  "admin.products.deleteConfirmationQuestion":
    'هل أنت متأكد من رغبتك في حذف "{name}"؟ سيؤدي هذا إلى إزالة المنتج نهائياً من الكتالوج.',
  "admin.products.productNotFound": "المنتج غير موجود",
  "admin.products.productNotFoundText":
    "المنتج الذي تبحث عنه غير موجود أو تم حذفه.",
  "admin.products.loadingProduct": "جاري تحميل المنتج...",
  "admin.products.sortBy": "ترتيب حسب",
  "admin.products.allStatus": "جميع الحالات",
  "admin.products.allCategories": "جميع الفئات",
  "admin.products.perPage": "في الصفحة",
  "admin.products.selected": "مُحدد",
  "admin.products.clearSelection": "مسح التحديد",
  "admin.products.bulkActivate": "تفعيل مجمع",
  "admin.products.bulkDeactivate": "إلغاء تفعيل مجمع",
  "admin.products.bulkDelete": "حذف مجمع",
  "admin.products.viewDetails": "عرض التفاصيل",
  "admin.products.duplicate": "نسخ",
  "admin.products.toggleFeatured": "تبديل الميزة",
  "admin.products.confirmBulkAction": "تأكيد الإجراء المجمع {action}",
  "admin.products.bulkActionQuestion":
    "هل أنت متأكد من رغبتك في {action} {count} منتج محدد؟",
  "admin.products.units": "وحدة",
  "admin.products.noImage": "لا توجد صورة",
  "admin.products.helpTitle": "تحتاج مساعدة؟",
  "admin.products.helpTips": [
    "يجب أن تكون صور المنتجات على الأقل 800×800 بكسل",
    "استخدم أسماء وصفية لتحسين السيو",
    "اضبط كميات المخزون بدقة لتتبع المخزون",
  ],
  "admin.products.previewProduct": "معاينة المنتج",
  "admin.products.preview": "معاينة",
  "admin.products.saveAsDraft": "حفظ كمسودة",
  "admin.products.fillDetails":
    "املأ تفاصيل المنتج أدناه لإضافة منتج جديد إلى الكتالوج",
  "admin.products.invalidImageUrl": "رابط صورة غير صحيح",
  "admin.products.imageUploadSoon": "وظيفة رفع الصور قريباً",
  "admin.products.generateSku": "توليد SKU",
  "admin.products.previewSoon": "وظيفة المعاينة قريباً",
  "admin.products.draftSoon": "وظيفة حفظ المسودة قريباً",
  "admin.products.newProductActive":
    "المنتجات الجديدة نشطة افتراضياً. يمكنك تغيير هذا لاحقاً.",

  // Admin Categories
  "admin.categories.management": "إدارة الفئات",
  "admin.categories.subtitle": "إدارة فئات المنتجات والتنظيم",
  "admin.categories.addCategory": "إضافة فئة",
  "admin.categories.createCategory": "إنشاء فئة جديدة",
  "admin.categories.editCategory": "تعديل الفئة",
  "admin.categories.categoryDetails": "تفاصيل الفئة",
  "admin.categories.manageOrder": "إدارة الترتيب",
  "admin.categories.totalCategories": "إجمالي الفئات",
  "admin.categories.activeCategories": "الفئات النشطة",
  "admin.categories.inactiveCategories": "الفئات غير النشطة",
  "admin.categories.totalProducts": "إجمالي المنتجات",
  "admin.categories.order": "الترتيب",
  "admin.categories.categoryName": "اسم الفئة",
  "admin.categories.urlSlug": "رابط URL",
  "admin.categories.urlSlugHelp": "نسخة ملائمة للرابط من الاسم",
  "admin.categories.categoryDescription": "الوصف",
  "admin.categories.descriptionHelp": "وصف اختياري لهذه الفئة",
  "admin.categories.descriptionPlaceholder":
    "اوصف هذه الفئة والمنتجات التي تحتويها...",
  "admin.categories.categoryImage": "صورة الفئة",
  "admin.categories.imageUrl": "رابط الصورة",
  "admin.categories.imageUrlHelp": "أدخل رابط الصورة أو ارفع أدناه",
  "admin.categories.uploadImage": "رفع صورة",
  "admin.categories.imagePreview": "معاينة الصورة",
  "admin.categories.categoryStatus": "حالة الفئة",
  "admin.categories.categoryActive": "الفئة نشطة",
  "admin.categories.organization": "التنظيم",
  "admin.categories.sortOrder": "ترتيب الفرز",
  "admin.categories.sortOrderHelp": "الأرقام الأصغر تظهر أولاً",
  "admin.categories.categoryInfo": "معلومات الفئة",
  "admin.categories.categorySettings": "إعدادات الفئة",
  "admin.categories.categoryGuidelines": "إرشادات الفئة",
  "admin.categories.guidelines": [
    "استخدم أسماء واضحة ووصفية",
    "يجب أن تكون صور الفئات على الأقل 400×400 بكسل",
    "اجعل الأوصاف مختصرة ومفيدة",
    "استخدم ترتيب الفرز لتنظيم عرض الفئات",
  ],
  "admin.categories.quickActions": "إجراءات سريعة",
  "admin.categories.changeImage": "تغيير الصورة",
  "admin.categories.previewCategory": "معاينة الفئة",
  "admin.categories.viewDetails": "عرض التفاصيل",
  "admin.categories.duplicateCategory": "نسخ الفئة",
  "admin.categories.dangerZone": "منطقة الخطر",
  "admin.categories.deleteCategory": "حذف الفئة",
  "admin.categories.deleteWarning":
    'حذف هذه الفئة سيزيلها نهائياً. ستنتقل المنتجات إلى "غير مصنفة".',
  "admin.categories.backToCategories": "العودة للفئات",
  "admin.categories.saveChanges": "حفظ التغييرات",
  "admin.categories.saving": "جاري الحفظ...",
  "admin.categories.creating": "جاري الإنشاء...",
  "admin.categories.deleting": "جاري الحذف...",
  "admin.categories.categoryId": "معرف الفئة",
  "admin.categories.productCount": "المنتجات",
  "admin.categories.lastUpdated": "آخر تحديث",
  "admin.categories.created": "تم الإنشاء",
  "admin.categories.deleteConfirmation": "حذف الفئة",
  "admin.categories.deleteConfirmationText": "هذا الإجراء لا يمكن التراجع عنه!",
  "admin.categories.deleteConfirmationQuestion":
    'هل أنت متأكد من رغبتك في حذف "{name}"؟',
  "admin.categories.deleteWithProducts":
    'تحتوي هذه الفئة على {count} منتج سينتقل إلى "غير مصنفة".',
  "admin.categories.categoryNotFound": "الفئة غير موجودة",
  "admin.categories.categoryNotFoundText":
    "الفئة التي تبحث عنها غير موجودة أو تم حذفها.",
  "admin.categories.loadingCategory": "جاري تحميل الفئة...",
  "admin.categories.status": "الحالة",
  "admin.categories.allCategories": "جميع الفئات",
  "admin.categories.activeOnly": "النشطة فقط",
  "admin.categories.searchCategories": "البحث في الفئات...",
  "admin.categories.selected": "فئات محددة",
  "admin.categories.clearSelection": "مسح التحديد",
  "admin.categories.bulkActivate": "تفعيل مجمع",
  "admin.categories.bulkDeactivate": "إلغاء تفعيل مجمع",
  "admin.categories.viewCategory": "عرض الفئة",
  "admin.categories.viewLive": "عرض مباشر",
  "admin.categories.duplicate": "نسخ",
  "admin.categories.inactiveWarning":
    "الفئات غير النشطة لن تُعرض للعملاء لكن المنتجات تبقى قابلة للوصول عبر الروابط المباشرة.",
  "admin.categories.newCategoryActive":
    "الفئات الجديدة نشطة افتراضياً. يمكنك تغيير هذا بعد الإنشاء.",
  "admin.categories.additionalSettings":
    "الإعدادات الإضافية ستكون متاحة بعد إنشاء الفئة.",
  "admin.categories.fillDetails": "املأ تفاصيل الفئة أدناه لتنظيم منتجاتك",
  "admin.categories.invalidImageUrl": "رابط صورة غير صحيح",
  "admin.categories.sortManagementSoon": "إدارة الترتيب قريباً",
  "admin.categories.duplicateSoon": "وظيفة النسخ قريباً",

  // Admin Users
  "admin.users.management": "إدارة المستخدمين",
  "admin.users.subtitle": "إدارة حسابات المستخدمين والتفعيلات والصلاحيات",
  "admin.users.pendingUsers": "المستخدمون المعلقون",
  "admin.users.allUsers": "جميع المستخدمين",
  "admin.users.totalUsers": "إجمالي المستخدمين",
  "admin.users.activeUsers": "المستخدمون النشطون",
  "admin.users.unverifiedPhone": "هاتف غير محقق",
  "admin.users.user": "المستخدم",
  "admin.users.contact": "جهة الاتصال",
  "admin.users.role": "الدور",
  "admin.users.joined": "انضم",
  "admin.users.phoneVerified": "هاتف محقق",
  "admin.users.phoneNotVerified": "هاتف غير محقق",
  "admin.users.pendingActivation": "في انتظار التفعيل",
  "admin.users.allRoles": "جميع الأدوار",
  "admin.users.userRole": "مستخدم",
  "admin.users.adminRole": "مشرف",
  "admin.users.allStatus": "جميع الحالات",
  "admin.users.verified": "محقق",
  "admin.users.notVerified": "غير محقق",
  "admin.users.usersSelected": "مستخدمين محددين",
  "admin.users.viewDetails": "عرض التفاصيل",
  "admin.users.editUser": "تعديل المستخدم",
  "admin.users.activate": "تفعيل",
  "admin.users.deactivate": "إلغاء تفعيل",
  "admin.users.bulkActivation": "تفعيل مجمع",
  "admin.users.bulkDeactivation": "إلغاء تفعيل مجمع",
  "admin.users.confirmBulkActivation": "تأكيد التفعيل المجمع",
  "admin.users.confirmBulkDeactivation": "تأكيد إلغاء التفعيل المجمع",
  "admin.users.bulkActivationQuestion":
    "هل أنت متأكد من رغبتك في تفعيل {count} مستخدم محدد؟",
  "admin.users.bulkDeactivationQuestion":
    "هل أنت متأكد من رغبتك في إلغاء تفعيل {count} مستخدم محدد؟",
  "admin.users.userDetails": "تفاصيل المستخدم",
  "admin.users.userNotFound": "المستخدم غير موجود",
  "admin.users.userNotFoundText":
    "المستخدم الذي تبحث عنه غير موجود أو تم حذفه.",
  "admin.users.loadingUser": "جاري تحميل تفاصيل المستخدم...",
  "admin.users.personalInformation": "المعلومات الشخصية",
  "admin.users.accountInformation": "معلومات الحساب",
  "admin.users.userId": "معرف المستخدم",
  "admin.users.phoneVerification": "تحقق الهاتف",
  "admin.users.accountStatus": "حالة الحساب",
  "admin.users.memberSince": "عضو منذ",
  "admin.users.activatedOn": "تم التفعيل في",
  "admin.users.administrator": "مشرف",
  "admin.users.activateUser": "تفعيل المستخدم",
  "admin.users.deactivateUser": "إلغاء تفعيل المستخدم",
  "admin.users.startEdit": "تعديل",
  "admin.users.saveEdit": "حفظ",
  "admin.users.cancelEdit": "إلغاء",
  "admin.users.processing": "جاري المعالجة...",
  "admin.users.profile": "الملف الشخصي",
  "admin.users.activity": "النشاط",
  "admin.users.security": "الأمان",
  "admin.users.accountActivityHistory": "تاريخ نشاط الحساب",
  "admin.users.action": "الإجراء",
  "admin.users.dateTime": "التاريخ والوقت",
  "admin.users.details": "التفاصيل",
  "admin.users.securityStatus": "حالة الأمان",
  "admin.users.securityActions": "إجراءات الأمان",
  "admin.users.phoneVerificationCompleted": "تحقق الهاتف: مكتمل",
  "admin.users.phoneVerificationPending": "تحقق الهاتف: معلق",
  "admin.users.accountActivationActive": "تفعيل الحساب: نشط",
  "admin.users.accountActivationPending":
    "تفعيل الحساب: في انتظار موافقة المشرف",
  "admin.users.adminPrivileges": "هذا المستخدم لديه صلاحيات مشرف",
  "admin.users.resetPassword": "إعادة تعيين كلمة المرور (قريباً)",
  "admin.users.forceReverification": "إجبار إعادة التحقق (قريباً)",
  "admin.users.suspendAccount": "تعليق الحساب",
  "admin.users.cannotActivate": "لا يمكن التفعيل: الهاتف غير محقق",
  "admin.users.activating": "جاري التفعيل...",

  // Admin Users - Pending
  "admin.users.pending.title": "تفعيلات المستخدمين المعلقة",
  "admin.users.pending.subtitle":
    "المستخدمون الذين حققوا أرقام هواتفهم وينتظرون موافقة المشرف",
  "admin.users.pending.noUsers": "لا يوجد مستخدمون معلقون",
  "admin.users.pending.noUsersSubtitle":
    "تم تفعيل جميع المستخدمين أو لا يزالون يحققون أرقام هواتفهم.",
  "admin.users.pending.noMatching": "لم يتم العثور على مستخدمين مطابقين",
  "admin.users.pending.noMatchingSubtitle":
    'لا يوجد مستخدمون يطابقون "{query}". جرب مصطلح بحث مختلف.',
  "admin.users.pending.clearSearch": "مسح البحث",
  "admin.users.pending.selectAll": "تحديد جميع المستخدمين المرئيين",
  "admin.users.pending.activateSelected": "تفعيل المحددين",
  "admin.users.pending.clear": "مسح",
  "admin.users.pending.confirmBulkActivation": "تأكيد التفعيل المجمع",
  "admin.users.pending.bulkActivationText":
    "هل أنت متأكد من رغبتك في تفعيل {count} مستخدم محدد؟ سيتلقون إشعارات SMS حول تفعيل حساباتهم.",
  "admin.users.pending.activatingUsers": "جاري التفعيل...",
  "admin.users.pending.activateUsers": "تفعيل المستخدمين",

  // Admin Settings
  "admin.settings.title": "إعدادات النظام",
  "admin.settings.subtitle": "تكوين إعدادات التطبيق والتفضيلات",
  "admin.settings.siteInfo": "معلومات الموقع",
  "admin.settings.siteName": "اسم الموقع",
  "admin.settings.regional": "الإعدادات الإقليمية",
  "admin.settings.currency": "العملة",
  "admin.settings.timezone": "المنطقة الزمنية",
  "admin.settings.systemStatus": "حالة النظام",
  "admin.settings.maintenanceMode": "وضع الصيانة",
  "admin.settings.autoApprove": "الموافقة التلقائية على المستخدمين",
  "admin.settings.maintenanceInfo": "وضع الصيانة سيعرض صفحة صيانة للزوار.",
  "admin.settings.saveGeneral": "حفظ الإعدادات العامة",
  "admin.settings.securityConfig": "تكوين الأمان",
  "admin.settings.twoFactor": "تفعيل المصادقة الثنائية",
  "admin.settings.requirePhone": "طلب تحقق الهاتف",
  "admin.settings.sessionTimeout": "انتهاء مهلة الجلسة (دقائق)",
  "admin.settings.maxLoginAttempts": "الحد الأقصى لمحاولات تسجيل الدخول",
  "admin.settings.passwordMinLength": "الحد الأدنى لطول كلمة المرور",
  "admin.settings.securityWarning":
    "قد تؤثر تغييرات الأمان على جلسات المستخدمين وتتطلب إعادة المصادقة.",
  "admin.settings.saveSecurity": "حفظ إعدادات الأمان",
  "admin.settings.notificationPrefs": "تفضيلات الإشعارات",
  "admin.settings.emailNotifications": "إشعارات البريد الإلكتروني",
  "admin.settings.smsNotifications": "إشعارات الرسائل النصية",
  "admin.settings.alertTypes": "أنواع التنبيهات",
  "admin.settings.newUserAlerts": "تنبيهات تسجيل المستخدمين الجدد",
  "admin.settings.lowStockAlerts": "تنبيهات المخزون المنخفض",
  "admin.settings.orderNotifications": "إشعارات الطلبات",
  "admin.settings.saveNotifications": "حفظ إعدادات الإشعارات",
  "admin.settings.databaseBackup": "نسخ احتياطي لقاعدة البيانات",
  "admin.settings.backupDescription":
    "إنشاء نسخة احتياطية من قاعدة البيانات تتضمن جميع المنتجات والفئات وبيانات المستخدمين.",
  "admin.settings.createBackup": "إنشاء نسخة احتياطية",
  "admin.settings.scheduleBackup": "جدولة النسخ الاحتياطي",
  "admin.settings.backupInfo":
    "يتم إنشاء النسخ الاحتياطية تلقائياً يومياً في الساعة 2:00 صباحاً. يمكن إنشاء نسخ احتياطية يدوية في أي وقت.",
  "admin.settings.recentBackups": "النسخ الاحتياطية الأخيرة",
  "admin.settings.automatic": "تلقائي",
  "admin.settings.manual": "يدوي",
  "admin.settings.backup": "نسخة احتياطية",
  "admin.settings.backupTestWarning":
    "اختبر دائماً نسخك الاحتياطية في بيئة اختبار قبل الاعتماد عليها للاستعادة.",
  "admin.settings.dangerZone": "منطقة الخطر",
  "admin.settings.restoreWarning":
    "عمليات الاستعادة ستقوم بالكتابة فوق البيانات الحالية. هذا الإجراء لا يمكن التراجع عنه.",
  "admin.settings.createBackupTitle": "إنشاء نسخة احتياطية لقاعدة البيانات",
  "admin.settings.backupConfirmation":
    "هل أنت متأكد من رغبتك في إنشاء نسخة احتياطية يدوية؟ قد تستغرق هذه العملية بضع دقائق حسب حجم قاعدة البيانات.",
  "admin.settings.creating": "جاري الإنشاء...",

  // Common months
  "common.january": "يناير",
  "common.february": "فبراير",
  "common.march": "مارس",
  "common.april": "أبريل",
  "common.may": "مايو",
  "common.june": "يونيو",
  "common.general": "عام",
  "common.important": "مهم",
  "common.operation": "العملية",

  // Admin Analytics
  "admin.analytics.dateRange": "النطاق الزمني",
  "admin.analytics.last7Days": "آخر 7 أيام",
  "admin.analytics.last30Days": "آخر 30 يوماً",
  "admin.analytics.last90Days": "آخر 90 يوماً",
  "admin.analytics.lastYear": "العام الماضي",
  "admin.analytics.salesRevenueTrends": "اتجاهات المبيعات والإيرادات",
  "admin.analytics.sales": "المبيعات",
  "admin.analytics.revenue": "الإيرادات",
  "admin.analytics.categoryPerformance": "أداء الفئات",
  "admin.analytics.avgPrice": "متوسط السعر",
  "admin.analytics.issue": "المشكلة",
  "admin.analytics.inventoryOverview": "نظرة عامة على المخزون حسب الفئة",

  // Admin Bulk Operations
  "admin.bulk.bulkOperation": "العملية المجمعة",
  "admin.bulk.updateCategories.short": "تحديث الفئات",
  "admin.bulk.updatePrices.short": "تحديث الأسعار",
  "admin.bulk.updateCodes.short": "تحديث رموز المنتجات",
  "admin.bulk.updateCategories.title": "تحديث فئات المنتجات",
  "admin.bulk.updateCategories.description": "تعيين المنتجات لفئات مختلفة",
  "admin.bulk.updatePrices.title": "تحديث أسعار المنتجات",
  "admin.bulk.updatePrices.description":
    "تعيين أو زيادة أو تطبيق تغييرات نسبية على الأسعار",
  "admin.bulk.updateCodes.title": "تحديث رموز المنتجات",
  "admin.bulk.updateCodes.description": "تغيير رموز المنتجات بشكل مجمع",
  "admin.bulk.useJSONFormat": "استخدم تنسيق JSON الموضح في لوحة المثال",
  "admin.bulk.bulkDataInput": "إدخال البيانات المجمعة",
  "admin.bulk.executeOperation": "تنفيذ العملية",
  "admin.bulk.jsonData": "بيانات JSON",
  "admin.bulk.jsonPlaceholder": "أدخل بيانات العملية المجمعة بتنسيق JSON...",
  "admin.bulk.exampleFormat": "تنسيق المثال",
  "admin.bulk.confirmOperation": "تأكيد العملية المجمعة",
  "admin.bulk.operationWarning":
    "هذا الإجراء سيؤثر على سجلات متعددة ولا يمكن التراجع عنه!",
  "admin.bulk.operationConfirmation":
    "هل أنت متأكد من رغبتك في تنفيذ هذه العملية المجمعة؟",
  "admin.bulk.processing": "جاري المعالجة...",
  "admin.bulk.execute": "تنفيذ",
  "admin.bulk.enterData": "يرجى إدخال البيانات المجمعة",
  "admin.bulk.selectOperation": "يرجى اختيار عملية",
  "admin.bulk.invalidJSON": "تنسيق JSON غير صحيح",
  "admin.bulk.updateSuccess": "تم تحديث {{count}} منتج بنجاح",
  "admin.bulk.updateFailed": "فشل في تحديث {{count}} منتج",
  "admin.bulk.priceUpdateSuccess": "تم تحديث أسعار {{count}} منتج",
  "admin.bulk.priceUpdateFailed": "فشل في تحديث أسعار {{count}} منتج",
  "admin.bulk.codeUpdateSuccess": "تم تحديث رموز {{count}} منتج",
  "admin.bulk.codeUpdateFailed": "فشل في تحديث رموز {{count}} منتج",

  // Admin Import/Export
  "admin.importExport.title": "استيراد / تصدير",
  "admin.importExport.subtitle": "استيراد وتصدير الاقسام والمنتجات",
  "admin.importExport.importData": "استيراد البيانات",
  "admin.importExport.importType": "نوع الاستيراد",
  "admin.importExport.selectCSV": "اختر ملف CSV",
  "admin.importExport.fileSize": "حجم الملف",
  "admin.importExport.dryRun": "تشغيل تجريبي (معاينة فقط)",
  "admin.importExport.skipErrors": "تخطي الأخطاء",
  "admin.importExport.dryRunInfo":
    "وضع التشغيل التجريبي: لن يتم استيراد أي بيانات فعلياً. استخدم هذا للتحقق من ملف CSV.",
  "admin.importExport.processing": "جاري المعالجة...",
  "admin.importExport.import": "استيراد {{type}}",
  "admin.importExport.downloadTemplate": "تحميل قالب {{type}}",
  "admin.importExport.exportData": "تصدير البيانات",
  "admin.importExport.exportDescription":
    "صدّر بياناتك الحالية بتنسيق CSV للنسخ الاحتياطي أو التحليل",
  "admin.importExport.exportAllProducts": "تصدير جميع المنتجات",
  "admin.importExport.exportAllCategories": "تصدير جميع الفئات",
  "admin.importExport.csvTemplates": "قوالب CSV",
  "admin.importExport.productTemplate": "قالب المنتجات",
  "admin.importExport.categoryTemplate": "قالب الفئات",
  "admin.importExport.importResults": "نتائج الاستيراد",
  "admin.importExport.totalRows": "إجمالي الصفوف",
  "admin.importExport.successful": "نجح",
  "admin.importExport.failed": "فشل",
  "admin.importExport.errors": "الأخطاء",
  "admin.importExport.row": "الصف",
  "admin.importExport.error": "الخطأ",
  "admin.importExport.data": "البيانات",
  "admin.importExport.showingErrors":
    "عرض أول {{showing}} أخطاء. الإجمالي: {{total}}",
  "admin.importExport.csvFileOnly": "يرجى اختيار ملف CSV",
  "admin.importExport.selectFile": "يرجى اختيار ملف للاستيراد",
  "admin.importExport.importError": "فشل الاستيراد",
  "admin.importExport.categoryImportError": "فشل استيراد الفئات",
  "admin.importExport.importSuccess": "تم استيراد {{count}} عنصر بنجاح",
  "admin.importExport.importFailed": "فشل في استيراد {{count}} عنصر",
  "admin.importExport.categoryImportSuccess": "تم استيراد {{count}} فئة بنجاح",
  "admin.importExport.categoryImportFailed": "فشل في استيراد {{count}} فئة",
  "admin.importExport.exportSuccess": "تم تصدير {{type}} بنجاح",
  "admin.importExport.exportError": "فشل التصدير: {{error}}",
  "admin.importExport.templateDownloaded": "تم تحميل قالب {{type}}",
  "admin.importExport.templateError": "فشل تحميل القالب: {{error}}",

  // Admin General
  "admin.backup": "النسخ الاحتياطي والاستعادة",

  // Admin General Messages
  "admin.loading": "جاري التحميل...",
  "admin.error": "فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.",
  "admin.success": "تمت العملية بنجاح",
  "admin.noData": "لا توجد بيانات متاحة",
  "admin.comingSoon": "هذه الوظيفة قريباً",
  "admin.moreActions": "إجراءات أكثر",
  "admin.selectAll": "تحديد الكل",
  "admin.clearSelection": "مسح التحديد",
  "admin.confirmAction": "تأكيد الإجراء",
  "admin.cannotUndo": "هذا الإجراء لا يمكن التراجع عنه!",

  // Featured Section
  "featured.title": "المنتجات المميزة",
  "featured.subtitle":
    "اكتشف مجموعتنا المختارة يدوياً من أشهر المنتجات عالية الجودة",
  "featured.viewAll": "عرض جميع المنتجات المميزة",

  // Orders Management
  "orders.management": "إدارة الطلبات",
  "orders.pendingOrders": "الطلبات المعلقة",
  "orders.avgOrderValue": "متوسط قيمة الطلب",
  "orders.searchPlaceholder":
    "البحث في الطلبات برقم الطلب أو العميل أو العنوان...",
  "orders.statusFilter": "تصفية الحالة",
  "orders.dateRange": "النطاق الزمني",
  "orders.allStatuses": "جميع الحالات",
  "orders.allTime": "كل الأوقات",
  "orders.today": "اليوم",
  "orders.thisWeek": "هذا الأسبوع",
  "orders.thisMonth": "هذا الشهر",
  "orders.thisQuarter": "هذا الربع",
  "orders.allOrdersCount": "جميع الطلبات ({{count}})",
  "orders.pendingCount": "المعلقة ({{count}})",
  "orders.confirmedCount": "المؤكدة ({{count}})",
  "orders.preparing": "قيد التحضير",
  "orders.readyToShip": "جاهز للشحن",
  "orders.shipped": "تم الشحن",
  "orders.delivered": "تم التسليم",
  "orders.orderNumber": "رقم الطلب",
  "orders.customer": "العميل",
  "orders.items": "العناصر",
  "orders.total": "الإجمالي",
  "orders.customerNumber": "عميل #{{id}}",
  "orders.itemsCount": "{{count}} عنصر",
  "orders.rowsPerPage": "صفوف في الصفحة:",
  "orders.displayedRows": "{{from}}-{{to}} من {{count}}",
  "orders.noOrdersFound": "لم يتم العثور على طلبات",
  "orders.noOrdersMatch": 'لا توجد طلبات تطابق "{{query}}"',
  "orders.noOrdersToDisplay": "لا توجد طلبات للعرض",
  "orders.updateStatus": "تحديث الحالة",
  "orders.cancelOrder": "إلغاء الطلب",
  "orders.updateOrderStatus": "تحديث حالة الطلب",
  "orders.updateStatusInfo": "تحديث حالة الطلب #{{orderNumber}}",
  "orders.newStatus": "الحالة الجديدة",
  "orders.notesOptional": "ملاحظات (اختيارية)",
  "orders.statusUpdateNotes": "أضف أي ملاحظات حول تحديث الحالة...",
  "orders.updating": "جاري التحديث...",
  "orders.cancelOrderWarning":
    "هل أنت متأكد من رغبتك في إلغاء الطلب #{{orderNumber}}؟ هذا الإجراء لا يمكن التراجع عنه.",
  "orders.cancellationReason": "سبب الإلغاء",
  "orders.cancellationReasonPlaceholder": "يرجى تقديم سبب لإلغاء هذا الطلب...",
  "orders.cancelling": "جاري الإلغاء...",
  "orders.statusUpdated": "تم تحديث حالة الطلب بنجاح",
  "orders.statusUpdateFailed": "فشل في تحديث حالة الطلب",
  "orders.orderCancelled": "تم إلغاء الطلب بنجاح",
  "orders.cancelFailed": "فشل في إلغاء الطلب",

  // Users Management
  "admin.users.userActivated": "تم تفعيل المستخدم بنجاح",
  "admin.users.userDeactivated": "تم إلغاء تفعيل المستخدم بنجاح",
  "admin.users.activationFailed": "فشل في تفعيل المستخدم",
  "admin.users.deactivationFailed": "فشل في إلغاء تفعيل المستخدم",
  "admin.users.searchUsers":
    "البحث في المستخدمين بالاسم أو الهاتف أو البريد الإلكتروني...",
  "admin.users.statusFilter": "تصفية الحالة",
  "admin.users.activeOnly": "النشطون فقط",
  "admin.users.inactiveOnly": "غير النشطين فقط",
  "admin.users.viewFullList": "عرض القائمة الكاملة للمستخدمين",
  "admin.users.recentUsers": "المستخدمون الأخيرون ({{count}})",
  "admin.users.pendingApproval": "في انتظار الموافقة ({{count}})",
  "admin.users.noUsersFound": "لم يتم العثور على مستخدمين",
  "admin.users.noUsersMatch": 'لا يوجد مستخدمون يطابقون "{{query}}"',
  "admin.users.noUsersToDisplay": "لا يوجد مستخدمون للعرض",
  "admin.users.viewPendingUsers": "عرض المستخدمين المعلقين ({{count}})",
  "admin.users.confirmActivation": "تأكيد تفعيل المستخدم",
  "admin.users.confirmDeactivation": "تأكيد إلغاء تفعيل المستخدم",
  "admin.users.activationQuestion":
    "هل أنت متأكد من رغبتك في تفعيل حساب هذا المستخدم؟",
  "admin.users.deactivationQuestion":
    "هل أنت متأكد من رغبتك في إلغاء تفعيل حساب هذا المستخدم؟",
  "admin.users.activationNotification": "سيتلقى المستخدم إشعار SMS.",
  "admin.users.confirmActivationButton": "تأكيد التفعيل",
  "admin.users.confirmDeactivationButton": "تأكيد إلغاء التفعيل",
  "admin.codes.quantity": "Number of codes to generate",

  "cart.itemsCount": "{{count}} عنصر",
  "cart.viewCart": "عرض السلة",
  "cart.clear": "مسح",

  // Categories Loading and States
  "categories.loading": "جاري تحميل الفئات...",
  "categories.productsCount": "{{count}} منتج",

  // Featured Products
  "products.loadingFeatured": "جاري تحميل المنتجات المميزة...",
  "products.noFeaturedAvailable": "لا توجد منتجات مميزة متاحة في الوقت الحالي.",

  // Hero Section
  "hero.imagePlaceholder": "عنصر نائب لصورة البطل",

  // Newsletter
  "newsletter.invalidEmail": "يرجى إدخال عنوان بريد إلكتروني صحيح",
  "newsletter.subscribeSuccess": "تم الاشتراك في النشرة الإخبارية بنجاح!",
  "newsletter.subscribeError": "فشل في الاشتراك. يرجى المحاولة مرة أخرى.",

  "auth.signInToAccess": "سجل دخولك للوصول إلى حسابك",
  "auth.success": "تم تسجيل الخروج بنجاح",
  "auth.error": "فشل تسجيل الخروج",
  "auth.welcomeBack": "مرحبا بعودتك",
  // أضف هذه المفاتيح إلى الترجمات العربية الموجودة

  // تفاصيل المنتجات والمواصفات
  "products.noImageAvailable": "لا توجد صورة متاحة",
  "products.warranty": "الضمان",
  "products.warranty.included": "ضمان لمدة عامين مُتضمّن",
  "products.returns": "الإرجاع",
  "products.returns.policy": "سياسة إرجاع لمدة 30 يوماً",
  "products.shipping.free": "شحن مجاني للطلبات أكثر من 50,000 دينار عراقي",
  "products.rating": "التقييم",
  "products.weight.kg": "كغ",
  "products.dimensions.format": "الطول × العرض × الارتفاع (سم)",
  "products.images.multiple": "صور متعددة متاحة",
  "products.images.count": "{{count}} صورة",
  "products.priceHistory": "تاريخ الأسعار",
  "products.availability": "التوفر",
  "products.brandNew": "جديد كلياً",
  "products.condition": "الحالة",

  // ميزات الجملة والأعمال
  "wholesale.title": "ميزات البيع بالجملة",
  "wholesale.pricing": "تسعير الجملة",
  "wholesale.pricing.help":
    "يرجى إدخال السعر الذي تخطط لبيع كل عنصر به. هذا يساعدنا على فهم نموذج عملك وتقديم دعم أفضل.",
  "wholesale.sellingPrice": "سعر البيع الخاص بك",
  "wholesale.sellingPrice.placeholder": "أدخل سعر البيع",
  "wholesale.sellingPrice.help": "أدخل السعر الذي ستبيع به هذا العنصر",
  "wholesale.profitMargin": "هامش الربح: {{margin}}%",
  "wholesale.profitCalculation": "الربح لكل عنصر: {{profit}}",
  "wholesale.revenue": "الإيرادات",
  "wholesale.revenue.potential": "الإيرادات المحتملة: {{revenue}}",
  "wholesale.revenue.total": "إجمالي الإيرادات: {{revenue}}",
  "wholesale.profit.estimated": "الربح المقدر: {{profit}}",
  "wholesale.margin.average": "متوسط الهامش: {{margin}}%",
  "wholesale.analytics": "تحليلات طلبات الجملة",
  "wholesale.business.support": "دعم الأعمال",
  "wholesale.business.support.subtitle": "مدير حساب مخصص",
  "wholesale.tracking": "تتبع الأرباح",
  "wholesale.tracking.subtitle": "راقب هوامشك",

  // تحسينات عربة التسوق
  "cart.sellingPrice.required":
    "يرجى إدخال أسعار البيع لجميع العناصر قبل إتمام الطلب",
  "cart.sellingPrice.validation":
    "يرجى إدخال أسعار البيع لجميع العناصر في عربة التسوق",
  "cart.wholesale.info":
    "تسعير الجملة: يرجى إدخال السعر الذي تخطط لبيع كل عنصر به",
  "cart.items.withSellingPrice": "العناصر مع سعر البيع: {{count}}/{{total}}",
  "cart.benefits.title": "فوائد البيع بالجملة",

  // رسائل الخطأ والتحقق
  "validation.required": "هذا الحقل مطلوب",
  "validation.email.invalid": "يرجى إدخال عنوان بريد إلكتروني صحيح",
  "validation.phone.invalid": "يرجى إدخال رقم هاتف صحيح",
  "validation.password.minLength":
    "يجب أن تكون كلمة المرور {{length}} أحرف على الأقل",
  "validation.password.mismatch": "كلمات المرور غير متطابقة",
  "validation.price.positive": "يجب أن يكون السعر أكبر من 0",
  "validation.quantity.positive": "يجب أن تكون الكمية أكبر من 0",
  "validation.url.invalid": "يرجى إدخال رابط صحيح",

  // رسائل التحميل والحالة
  "loading.products": "جاري تحميل المنتجات...",
  "loading.categories": "جاري تحميل الفئات...",
  "loading.orders": "جاري تحميل الطلبات...",
  "loading.users": "جاري تحميل المستخدمين...",
  "loading.saving": "جاري الحفظ...",
  "loading.updating": "جاري التحديث...",
  "loading.deleting": "جاري الحذف...",
  "loading.uploading": "جاري الرفع...",
  "loading.processing": "جاري المعالجة...",

  // رسائل النجاح
  "success.product.created": "تم إنشاء المنتج بنجاح",
  "success.product.updated": "تم تحديث المنتج بنجاح",
  "success.product.deleted": "تم حذف المنتج بنجاح",
  "success.category.created": "تم إنشاء الفئة بنجاح",
  "success.category.updated": "تم تحديث الفئة بنجاح",
  "success.category.deleted": "تم حذف الفئة بنجاح",
  "success.order.placed": "تم إرسال الطلب بنجاح",
  "success.order.updated": "تم تحديث الطلب بنجاح",
  "success.profile.updated": "تم تحديث الملف الشخصي بنجاح",
  "success.password.changed": "تم تغيير كلمة المرور بنجاح",

  // رسائل الخطأ
  "error.generic": "حدث خطأ. يرجى المحاولة مرة أخرى.",
  "error.network": "خطأ في الشبكة. يرجى التحقق من اتصالك.",
  "error.unauthorized": "غير مصرح لك بتنفيذ هذا الإجراء.",
  "error.forbidden": "تم رفض الوصول.",
  "error.notFound": "المورد المطلوب غير موجود.",
  "error.validation": "يرجى التحقق من إدخالك والمحاولة مرة أخرى.",
  "error.server": "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.",
  "error.upload.failed": "فشل الرفع. يرجى المحاولة مرة أخرى.",
  "error.upload.size": "حجم الملف كبير جداً. الحد الأقصى {{size}} ميجابايت.",
  "error.upload.type": "نوع ملف غير صحيح. يرجى اختيار {{types}}.",

  // رفع الملفات
  "upload.dragDrop": "اسحب وأفلت الملفات هنا، أو انقر للاختيار",
  "upload.selectFiles": "اختر الملفات",
  "upload.maxSize": "الحد الأقصى لحجم الملف: {{size}} ميجابايت",
  "upload.supportedFormats": "التنسيقات المدعومة: {{formats}}",
  "upload.multipleSupported": "اختيار ملفات متعددة مدعوم",
  "upload.maxFiles": "الحد الأقصى {{count}} ملف",
  "upload.removeFile": "إزالة الملف",
  "upload.replaceFile": "استبدال الملف",

  // الإشعارات
  "notification.welcome": "مرحباً بك في جناح!",
  "notification.orderConfirmed": "تم تأكيد طلبك",
  "notification.orderShipped": "تم شحن طلبك",
  "notification.orderDelivered": "تم تسليم طلبك",
  "notification.lowStock": "تنبيه مخزون منخفض لـ {{product}}",
  "notification.newUser": "تسجيل مستخدم جديد: {{name}}",

  // الوقت والتواريخ
  "time.ago": "منذ {{time}}",
  "time.justNow": "الآن",
  "time.minutes": "منذ {{count}} دقيقة",
  "time.hours": "منذ {{count}} ساعة",
  "time.days": "منذ {{count}} يوم",
  "time.weeks": "منذ {{count}} أسبوع",
  "time.months": "منذ {{count}} شهر",

  // الوحدات والقياسات
  "units.pieces": "قطعة",
  "units.items": "عنصر",
  "units.kg": "كغ",
  "units.cm": "سم",
  "units.iqd": "د.ع",
  "units.percent": "%",

  // معرض الصور
  "gallery.mainImage": "الصورة الرئيسية",
  "gallery.viewLarger": "عرض أكبر",
  "gallery.previousImage": "الصورة السابقة",
  "gallery.nextImage": "الصورة التالية",
  "gallery.imageCounter": "{{current}} من {{total}}",
  "gallery.noImages": "لا توجد صور متاحة",

  // تحسينات البحث
  "search.noResultsFor": 'لم يتم العثور على نتائج لـ "{{query}}"',
  "search.showingResults": "عرض {{count}} نتيجة",
  "search.didYouMean": "هل تقصد: {{suggestion}}؟",
  "search.searchHistory": "تاريخ البحث",
  "search.clearHistory": "مسح التاريخ",
  "search.savedSearches": "عمليات البحث المحفوظة",

  // إدارة الطلبات للمشرف
  "admin.orders.title": "إدارة الطلبات",
  "admin.orders.subtitle": "إدارة طلبات العملاء والتتبع",
  "admin.orders.analytics": "تحليلات الطلبات",
  "admin.orders.updateStatus": "تحديث حالة الطلب",
  "admin.orders.statusHistory": "تاريخ الحالة",
  "admin.orders.customerInfo": "معلومات العميل",
  "admin.orders.orderTimeline": "المخطط الزمني للطلب",
  "admin.orders.orderItems": "عناصر الطلب",
  "admin.orders.wholesaleInfo": "معلومات الجملة",

  // إدارة المخزون
  "inventory.lowStock": "مخزون منخفض",
  "inventory.outOfStock": "نفد من المخزون",
  "inventory.inStock": "متوفر",
  "inventory.restockAlert": "تنبيه إعادة التخزين",
  "inventory.stockLevel": "مستوى المخزون",
  "inventory.reorderPoint": "نقطة إعادة الطلب",
  "inventory.lastRestocked": "آخر إعادة تخزين",

  // ميزات الأعمال
  "business.dashboard": "لوحة تحكم الأعمال",
  "business.analytics": "تحليلات الأعمال",
  "business.reports": "التقارير",
  "business.insights": "الرؤى",
  "business.performance": "الأداء",
  "business.growth": "النمو",

  // أسماء اللغات
  "language.english": "الإنجليزية",
  "language.arabic": "العربية",

  // مصطلحات البحث الشائعة
  "search.popular.iPhone15": "آيفون 15",
  "search.popular.macbookAir": "ماك بوك إير",
  "search.popular.samsungGalaxy": "سامسونغ غالاكسي",
  "search.popular.airpodsPro": "إيربودز برو",
  "search.popular.gamingLaptop": "لابتوب ألعاب",

  // بطاقة المنتج
  "productCard.reviewsCount": "{{count}} مراجعة",
  "productCard.stockCount": "{{count}} متوفر",

  // إعدادات المشرف - العملات
  "admin.settings.currencies.usd": "USD - الدولار الأمريكي",
  "admin.settings.currencies.eur": "EUR - اليورو",
  "admin.settings.currencies.iqd": "IQD - الدينار العراقي",

  // إعدادات المشرف - المناطق الزمنية
  "admin.settings.timezones.baghdad": "آسيا/بغداد (GMT+3)",
  "admin.settings.timezones.utc": "UTC (GMT+0)",
  "admin.settings.timezones.newYork": "أمريكا/نيويورك (GMT-5)",

  // إعدادات المشرف - افتراضية
  "admin.settings.defaultSiteName": "جناح للتجارة الإلكترونية",
  "admin.settings.defaultSiteDescription": "منصة تجارة إلكترونية حديثة",

  // مرشحات المنتجات
  "products.filters.clearAll": "مسح جميع المرشحات",
  "products.filters.productType": "نوع المنتج",
  "products.filters.allProducts": "جميع المنتجات",
  "products.filters.featuredOnly": "المميزة فقط",
  "products.filters.regularProducts": "المنتجات العادية",
  "products.filters.minPrice": "أقل سعر",
  "products.filters.maxPrice": "أعلى سعر",
  "products.filters.under50k": "أقل من 50,000 دينار",
  "products.filters.range100to500": "100,000 - 500,000 دينار",

  // العلامة التجارية للمشرف والتنقل
  "admin.brandName": "جناح المشرف",
  "admin.activationCodes": "رموز التفعيل",

  "cart.purchasePrice": "سعر الشراء",
  "cart.purchaseTotal": "إجمالي الشراء",
  "cart.totalToPay": "المجموع المطلوب دفعه",
  "cart.emptySubtitle.wholesale": "أضف بعض المنتجات لبدء طلب الجملة الخاص بك",
  "cart.freeDelivery.wholesale": "على جميع طلبات الجملة",
  "cart.signInToCheckout": "سجل الدخول للدفع",

  // Checkout keys
  "checkout.backToCart": "العودة للسلة",
  "checkout.reviewOrder": "مراجعة طلبك",
  "checkout.sellingPriceWarning":
    "يرجى العودة إلى سلتك وإدخال أسعار البيع لجميع العناصر قبل المتابعة للدفع.",
  "checkout.deliveringTo": "التوصيل إلى:",
  "checkout.deliveryAddress.required": "عنوان التوصيل *",
  "checkout.deliveryAddress.placeholder": "أدخل عنوان التوصيل الكامل...",
  "checkout.deliveryNotes.optional": "ملاحظات التوصيل (اختيارية)",
  "checkout.deliveryNotes.placeholder": "أي تعليمات خاصة للتوصيل...",
  "checkout.addressInfo":
    "يرجى تقديم عنوان مفصل يتضمن اسم الشارع ورقم المبنى وأي معالم.",
  "checkout.continueToDelivery": "المتابعة للتوصيل",
  "checkout.continueToPayment": "المتابعة للدفع",
  "checkout.selectPaymentMethod": "اختر طريقة الدفع",
  "checkout.cashOnDelivery.subtitle": "ادفع عند توصيل طلبك",
  "checkout.cashOnDelivery.info":
    "ستدفع نقداً عندما يسلم السائق طلبك. يرجى تجهيز المبلغ المطلوب.",
  "checkout.orderConfirmation": "تأكيد الطلب",
  "checkout.deliveryInformation": "معلومات التوصيل",
  "checkout.reviewWarning":
    "يرجى مراجعة طلبك بعناية. بمجرد الإرسال، قد لا تكون التغييرات ممكنة.",

  // Product detail keys
  "products.notFound": "المنتج غير موجود",
  "products.notFound.subtitle": "المنتج الذي تبحث عنه غير موجود أو تم حذفه.",
  "products.noImages": "لا توجد صور متاحة",
  "products.imageCounter": "{{current}} من {{total}}",
  "products.zoom": "تكبير",
  "products.fullSize": "الحجم الكامل",
  "products.code": "رمز المنتج",
  "products.fromReviews": "من المراجعات",
  "products.stockRemaining": "{{count}} عناصر متبقية فقط",
  "products.stockAvailable": "{{count}} عنصر متاح",
  "products.imagesCount": "{{count}} صورة",
  "products.wishlist.add": "أضف للمفضلة",
  "products.wishlist.remove": "إزالة من المفضلة",
  "products.freeShippingInfo": "شحن مجاني للطلبات أكثر من 50,000 دينار عراقي",
  "products.warrantyInfo": "ضمان لمدة عامين مُتضمّن",
  "products.returnInfo": "سياسة إرجاع لمدة 30 يوماً",
  "products.noDescription": "لا يوجد وصف متاح لهذا المنتج.",
  "products.imageCount": "{{count}} صورة منتج",
  "products.reviewsPlaceholder": "ستظهر مراجعات العملاء هنا.",
  "products.shippingPlaceholder": "ستظهر معلومات الشحن وخيارات التوصيل هنا.",
  "products.loadError": "فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.",

  // Profile keys
  "profile.information": "معلومات الملف الشخصي",
  "profile.phoneVerified": "هاتف محقق",
  "profile.phoneNotVerified": "هاتف غير محقق",
  "profile.accountActive": "حساب نشط",
  "profile.administrator": "مشرف",
  "profile.pendingWarning":
    "حسابك في انتظار موافقة المشرف. قد تكون بعض الميزات محدودة حتى يتم تفعيل حسابك.",
  "profile.notProvided": "غير مقدم",
  "profile.startShopping": "ابدأ التسوق",
  "profile.changePassword.subtitle": "حدث كلمة مرور حسابك",
  "profile.twoFactor.subtitle": "أضف طبقة أمان إضافية",
  "profile.emailNotifications.subtitle": "إدارة تفضيلات الإشعارات",
  "profile.changingPassword": "جاري التغيير...",

  // Search keys
  "search.noQuery": "لم يتم تقديم استعلام بحث",
  "search.noQuery.subtitle":
    "يرجى إدخال مصطلح بحث للعثور على المنتجات والفئات.",
  "search.error": "فشل البحث. يرجى المحاولة مرة أخرى.",
  "search.productsFound": "منتجات موجودة",
  "search.relevance": "الصلة",
  "search.noProducts": "لم يتم العثور على منتجات",
  "search.noProducts.help":
    "جرب البحث عن كلمات مفتاحية مختلفة أو تحقق من تبويب الفئات.",
  "search.noCategories": "لم يتم العثور على فئات",
  "search.noCategories.help":
    "جرب البحث عن كلمات مفتاحية مختلفة أو تحقق من تبويب المنتجات.",

  // Category keys
  "categories.notFound": "الفئة غير موجودة",
  "categories.notFound.subtitle":
    "الفئة التي تبحث عنها غير موجودة أو تم حذفها.",
  "categories.browse": "تصفح الفئات",
  "categories.available": "الفئات المتاحة",
  "categories.browseOther": "تصفح فئات أخرى",
  "categories.exploreMore": "استكشف المزيد من الفئات",
  "categories.browseAll": "تصفح جميع الفئات",
  "categories.showingResults": "عرض {{count}} نتيجة",
  "categories.totalProducts": "إجمالي المنتجات",

  // Common UI strings
  "common.items": "عناصر",
  "common.products": "منتجات",
  "common.saveChanges": "حفظ التغييرات",
  "common.saving": "جاري الحفظ...",

  // Wholesale specific
  "wholesale.benefits.title": "فوائد البيع بالجملة",
};

export default arTranslations;
