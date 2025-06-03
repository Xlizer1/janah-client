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
  "hero.title": "اكتشف منتجات مذهلة",
  "hero.subtitle":
    "تسوق أحدث الإلكترونيات والأجهزة والمزيد بأسعار لا تُقاوم وتوصيل سريع.",
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

  // Admin
  "admin.dashboard": "لوحة تحكم المشرف",
  "admin.products": "المنتجات",
  "admin.categories": "الفئات",
  "admin.users": "المستخدمون",
  "admin.analytics": "التحليلات",
  "admin.settings": "الإعدادات",
  "admin.bulkOperations": "العمليات المجمعة",
  "admin.importExport": "استيراد/تصدير",
  "admin.back": "العودة للمتجر",

  // Featured Section
  "featured.title": "المنتجات المميزة",
  "featured.subtitle":
    "اكتشف مجموعتنا المختارة يدوياً من أشهر المنتجات عالية الجودة",
  "featured.viewAll": "عرض جميع المنتجات المميزة",
};

export default arTranslations;
