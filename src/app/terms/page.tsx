"use client";

import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from "@mui/material";
import { Gavel, Info, Warning, CheckCircle } from "@mui/icons-material";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTranslation } from "@/hooks/useTranslation";

export default function TermsOfServicePage() {
  const { t, isRTL } = useTranslation();

  const sections = [
    {
      title: "أولاً: مقدمة",
      titleEn: "First: Introduction",
      icon: <Info color="primary" />,
      items: [
        "منصة الجناح هي منظومة تجارية إلكترونية تعمل كوسيط تنظيمي بين تجار الجملة المعتمدين والمشتركين (تجار المفرد)، وتقدّم خدمات تسويقية ولوجستية وتقنية لتسهيل عمليات البيع بالتجزئة.",
        "يشمل الاشتراك خدمات الوصول إلى كتالوج المنتجات بالجملة، أدوات تسويق متكاملة، إدارة الطلبات، وخدمة توصيل الزبائن داخل العراق.",
      ],
      itemsEn: [
        "Al Janah platform is an electronic business ecosystem that acts as an organizational intermediary between certified wholesale traders and subscribers (retail traders), providing marketing, logistical and technical services to facilitate retail operations.",
        "The subscription includes services for accessing the wholesale product catalog, integrated marketing tools, order management, and customer delivery service within Iraq.",
      ],
    },
    {
      title: "ثانياً: شروط الاشتراك",
      titleEn: "Second: Subscription Terms",
      icon: <CheckCircle color="success" />,
      items: [
        "الاشتراك متاح لجميع الأشخاص فوق 18 سنة القادرين على البيع بالتجزئة.",
        "يتم الاشتراك حصراً عن طريق وكلاء الجناح المعتمدين، ويُفعل الحساب بعد دفع رسوم الاشتراك واستلام كود التفعيل.",
        "رسوم الاشتراك غير قابلة للاسترداد.",
        "مدة الاشتراك سنة كاملة، قابلة للتجديد.",
      ],
      itemsEn: [
        "Subscription is available to all persons over 18 years old who are capable of retail sales.",
        "Subscription is done exclusively through certified Al Janah agents, and the account is activated after paying subscription fees and receiving the activation code.",
        "Subscription fees are non-refundable.",
        "Subscription period is one full year, renewable.",
      ],
    },
    {
      title: "ثالثاً: الخدمات المشمولة بالاشتراك",
      titleEn: "Third: Services Included in Subscription",
      icon: <CheckCircle color="primary" />,
      items: [
        "الوصول إلى أكثر من 4000 منتج من تجار جملة معتمدين بأسعار جملة حقيقية.",
        "تصميم هوية بصرية كاملة للبيج (اسم، لوجو، غلاف، ستايل).",
        "فيديو إعلاني باسم المشترك.",
        "10 صور احترافية لمنتجات مختارة.",
        "توفير محتوى تسويقي وكابشنات وتعليقات جاهزة.",
        "خدمة تغليف وتوصيل للطلبات داخل العراق.",
        "إدارة الطلبات من لحظة التثبيت إلى التوصيل.",
      ],
      itemsEn: [
        "Access to more than 4000 products from certified wholesale traders at real wholesale prices.",
        "Complete visual identity design for the page (name, logo, cover, style).",
        "Promotional video in the subscriber's name.",
        "10 professional photos of selected products.",
        "Providing marketing content and ready captions and comments.",
        "Packaging and delivery service for orders within Iraq.",
        "Order management from the moment of confirmation to delivery.",
      ],
    },
    {
      title: "رابعاً: آلية الطلب والتوصيل",
      titleEn: "Fourth: Order and Delivery Mechanism",
      icon: <CheckCircle color="info" />,
      items: [
        "التاجر المشترك مسؤول عن اختيار المنتجات من الكتالوج ورفعها على صفحته بالتسعير الذي يناسبه.",
        "عند استلام طلب من الزبون، يقوم التاجر بتثبيت الطلب في النظام، ويتم تنفيذه من قبل إدارة الجناح.",
        "يتم توصيل الطلبات خلال 1 إلى 2 يوم عمل حسب موقع الزبون داخل العراق.",
        "أجور التوصيل تتحملها شركة التوصيل في حال رفض الزبون الاستلام قبل الفحص، ولا يُحمّل التاجر أو المنصة أي تكاليف بهذا الخصوص.",
        "في حال تم فتح الطلب وفحصه من قبل الزبون ثم رفض استلامه بدون سبب مشروع، يتم احتساب أجور الإرجاع ويُناقش تعويض التاجر حسب الحالة.",
      ],
      itemsEn: [
        "The subscriber trader is responsible for selecting products from the catalog and uploading them to their page with pricing that suits them.",
        "When receiving an order from a customer, the trader confirms the order in the system, and it is executed by Al Janah management.",
        "Orders are delivered within 1 to 2 business days depending on the customer's location within Iraq.",
        "Delivery fees are borne by the delivery company if the customer refuses to receive before inspection, and neither the trader nor the platform bears any costs in this regard.",
        "If the order is opened and inspected by the customer and then refused without legitimate reason, return fees are calculated and trader compensation is discussed case by case.",
      ],
    },
    {
      title: "خامساً: سياسة التسعير والربح",
      titleEn: "Fifth: Pricing and Profit Policy",
      icon: <CheckCircle color="success" />,
      items: [
        "جميع الأسعار داخل الكتالوج أسعار جملة حقيقية.",
        "يملك التاجر المشترك حرية تسعير المنتج كما يشاء.",
        "الأرباح تعود بالكامل للمشترك، والمنصة لا تأخذ أي نسبة من المبيعات.",
      ],
      itemsEn: [
        "All prices in the catalog are real wholesale prices.",
        "The subscriber trader has the freedom to price the product as they wish.",
        "Profits go entirely to the subscriber, and the platform does not take any percentage of sales.",
      ],
    },
    {
      title: "سادساً: سياسة المرتجعات والإلغاء",
      titleEn: "Sixth: Returns and Cancellation Policy",
      icon: <Warning color="warning" />,
      items: [
        "في حال أرجع الزبون المنتج خلال 48 ساعة بسبب تلف أو خطأ في الطلب، تتحمل الجناح كامل تكاليف الإرجاع ويُعوض التاجر مجاناً.",
        'في حال رجع الزبون الطلب بسبب "تبديل رأي" أو "عدم الرد"، يتم إعلام التاجر ويُعاد شحن الطلب له مجاناً لمرة واحدة فقط.',
        "المنتجات التي تم فتحها أو استخدامها لا تُقبل للمرتجع إلا إذا ثبت وجود خلل.",
      ],
      itemsEn: [
        "If the customer returns the product within 48 hours due to damage or error in the order, Al Janah bears the full return costs and compensates the trader for free.",
        "If the customer returns the order due to 'change of mind' or 'no response', the trader is notified and the order is reshipped to them for free only once.",
        "Products that have been opened or used are not accepted for return unless a defect is proven.",
      ],
    },
    {
      title: "سابعاً: سياسة المحتوى والدعاية",
      titleEn: "Seventh: Content and Advertising Policy",
      icon: <Info color="info" />,
      items: [
        "الجناح تقدم للمشترك محتوى إعلاني احترافي باسمه يتضمن: فيديو تعريفي، صور للمنتجات، كابشنات وتعليقات، تصاميم وهوية كاملة للبيج.",
        "يُمنع بيع هذا المحتوى أو إعادة استخدامه خارج مشروع الجناح.",
      ],
      itemsEn: [
        "Al Janah provides the subscriber with professional advertising content in their name including: introductory video, product images, captions and comments, complete designs and page identity.",
        "Selling this content or reusing it outside the Al Janah project is prohibited.",
      ],
    },
    {
      title: "ثامناً: المسؤوليات القانونية",
      titleEn: "Eighth: Legal Responsibilities",
      icon: <Gavel color="error" />,
      items: [
        "المنصة لا تتحمل أي التزامات مالية ناتجة عن سوء استخدام حساب التاجر.",
        "التاجر ملزم بالعمل ضمن المنصة فقط وعدم بيع المنتجات أو إعادة تسويقها خارج النظام بدون تصريح.",
        "أي محاولة تلاعب أو عرض منتجات وهمية أو غير موجودة يعرض الحساب للإيقاف الفوري دون تعويض.",
      ],
      itemsEn: [
        "The platform does not bear any financial obligations resulting from misuse of the trader's account.",
        "The trader is obligated to work within the platform only and not sell products or re-market them outside the system without permission.",
        "Any attempt at manipulation or displaying fake or non-existent products exposes the account to immediate suspension without compensation.",
      ],
    },
    {
      title: "تاسعاً: الدعم والمتابعة",
      titleEn: "Ninth: Support and Follow-up",
      icon: <CheckCircle color="primary" />,
      items: [
        "فريق الجناح يقدّم دعم فني وتسويقي للتاجر طيلة فترة اشتراكه.",
        "يُتاح للتاجر طلب مراجعة شهرية لأداءه وطلب تعديل الخطط التسويقية.",
        "يتم رفع عدد متابعين البيج إلى 2000 متابع عراقي خلال أول شهر من تفعيل الحساب.",
      ],
      itemsEn: [
        "Al Janah team provides technical and marketing support to the trader throughout their subscription period.",
        "The trader can request a monthly review of their performance and request modification of marketing plans.",
        "The page followers are increased to 2000 Iraqi followers within the first month of account activation.",
      ],
    },
    {
      title: "عاشراً: شروط إنهاء الاشتراك أو الإيقاف",
      titleEn: "Tenth: Subscription Termination or Suspension Conditions",
      icon: <Warning color="error" />,
      items: [
        "يحق للتاجر إنهاء الاشتراك في أي وقت، لكن لا يُسترد أي مبلغ من الاشتراك.",
        "تحتفظ الجناح بحق تعليق الحساب في الحالات التالية: تكرار الشكاوى من الزبائن دون استجابة، مخالفة الشروط العامة.",
      ],
      itemsEn: [
        "The trader has the right to terminate the subscription at any time, but no amount of the subscription is refunded.",
        "Al Janah reserves the right to suspend the account in the following cases: repeated customer complaints without response, violation of general terms.",
      ],
    },
    {
      title: "الحادي عشر: سياسة تعديل الشروط",
      titleEn: "Eleventh: Terms Modification Policy",
      icon: <Info color="warning" />,
      items: [
        "يحق للجناح تعديل الشروط والسياسات في أي وقت.",
        "يُبلّغ المشتركون بأي تحديث عبر القنوات الرسمية.",
        "استمرار استخدام الخدمات يُعد موافقة تلقائية على التحديثات.",
      ],
      itemsEn: [
        "Al Janah has the right to modify terms and policies at any time.",
        "Subscribers are notified of any updates through official channels.",
        "Continued use of services is considered automatic approval of updates.",
      ],
    },
  ];

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Gavel sx={{ fontSize: 48, mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            {isRTL
              ? "السياسات والشروط الرسمية للتعامل مع المشتركين في منصة الجناح"
              : "Official Terms and Policies for Al Janah Platform Subscribers"}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontSize: "1.1rem" }}>
            {isRTL
              ? "يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا"
              : "Please read these terms carefully before using our services"}
          </Typography>
        </Paper>

        {/* Terms Sections */}
        {sections.map((section, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              mb: 3,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: "grey.50",
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {section.icon}
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                  }}
                >
                  {isRTL ? section.title : section.titleEn}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3 }}>
              <List sx={{ py: 0 }}>
                {(isRTL ? section.items : section.itemsEn).map(
                  (item, itemIndex) => (
                    <ListItem
                      key={itemIndex}
                      sx={{
                        px: 0,
                        py: 1,
                        alignItems: "flex-start",
                      }}
                    >
                      <Chip
                        label={itemIndex + 1}
                        size="small"
                        color="primary"
                        sx={{
                          minWidth: 32,
                          height: 24,
                          mr: isRTL ? 0 : 2,
                          ml: isRTL ? 2 : 0,
                          mt: 0.25,
                          flexShrink: 0,
                        }}
                      />
                      <ListItemText
                        primary={item}
                        primaryTypographyProps={{
                          variant: "body1",
                          lineHeight: 1.7,
                          color: "text.primary",
                        }}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </Box>

            {index < sections.length - 1 && (
              <Divider sx={{ borderColor: "grey.200" }} />
            )}
          </Paper>
        ))}

        {/* Contact Information */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            bgcolor: "primary.50",
            border: 1,
            borderColor: "primary.200",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 2, color: "primary.main" }}
          >
            {isRTL ? "معلومات الاتصال" : "Contact Information"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {isRTL
              ? "إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا:"
              : "If you have any questions about these terms and conditions, please contact us:"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body1">
              <strong>{isRTL ? "الهاتف:" : "Phone:"} +964 773 300 2076</strong>
            </Typography>
            <Typography variant="body1">
              <strong>
                {isRTL ? "البريد الإلكتروني:" : "Email:"} support@janah.com
              </strong>
            </Typography>
            <Typography variant="body1">
              <strong>
                {isRTL ? "العنوان:" : "Address:"}{" "}
                {isRTL ? "بغداد، العراق" : "Baghdad, Iraq"}
              </strong>
            </Typography>
          </Box>
        </Paper>

        {/* Footer Note */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {isRTL
              ? "© 2025 منصة الجناح. جميع الحقوق محفوظة."
              : "© 2025 Al Janah Platform. All rights reserved."}
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
}
