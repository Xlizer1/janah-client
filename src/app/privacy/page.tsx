"use client";

import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  Grid,
} from "@mui/material";
import { Security, Info, Shield, ContactMail } from "@mui/icons-material";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTranslation } from "@/hooks/useTranslation";

export default function PrivacyPolicyPage() {
  const { t, isRTL } = useTranslation();

  const sections = [
    {
      title: "المعلومات التي نجمعها",
      titleEn: "Information We Collect",
      icon: <Info color="primary" />,
      items: [
        "معلومات التسجيل: الاسم، رقم الهاتف، البريد الإلكتروني، العنوان",
        "معلومات الطلبات: تفاصيل المنتجات، عناوين التوصيل، تفضيلات الدفع",
        "معلومات تقنية: عنوان IP، نوع المتصفح، نظام التشغيل",
        "ملفات تعريف الارتباط لتحسين تجربة المستخدم",
      ],
      itemsEn: [
        "Registration information: Name, phone number, email, address",
        "Order information: Product details, delivery addresses, payment preferences",
        "Technical information: IP address, browser type, operating system",
        "Cookies to improve user experience",
      ],
    },
    {
      title: "كيف نستخدم معلوماتك",
      titleEn: "How We Use Your Information",
      icon: <Shield color="success" />,
      items: [
        "معالجة وإدارة طلباتك",
        "تقديم الدعم الفني والعملاء",
        "تحسين خدماتنا ومنتجاتنا",
        "إرسال إشعارات مهمة حول طلباتك",
        "التسويق (بموافقتك فقط)",
      ],
      itemsEn: [
        "Processing and managing your orders",
        "Providing technical and customer support",
        "Improving our services and products",
        "Sending important notifications about your orders",
        "Marketing (with your consent only)",
      ],
    },
    {
      title: "مشاركة المعلومات",
      titleEn: "Information Sharing",
      icon: <ContactMail color="warning" />,
      items: [
        "لا نبيع معلوماتك الشخصية لأطراف ثالثة",
        "نشارك المعلومات الضرورية مع شركات التوصيل لتنفيذ طلباتك",
        "قد نشارك معلومات مجهولة الهوية لأغراض الإحصاء",
        "نكشف المعلومات عند الطلب القانوني فقط",
      ],
      itemsEn: [
        "We do not sell your personal information to third parties",
        "We share necessary information with delivery companies to fulfill your orders",
        "We may share anonymized information for statistical purposes",
        "We disclose information only when legally required",
      ],
    },
    {
      title: "أمان البيانات",
      titleEn: "Data Security",
      icon: <Security color="error" />,
      items: [
        "نستخدم تشفير SSL لحماية معلوماتك",
        "نطبق إجراءات أمنية صارمة لحماية قواعد البيانات",
        "نحدد الوصول للمعلومات للموظفين المخولين فقط",
        "نراجع سياساتنا الأمنية بانتظام",
      ],
      itemsEn: [
        "We use SSL encryption to protect your information",
        "We implement strict security measures to protect databases",
        "We limit information access to authorized employees only",
        "We regularly review our security policies",
      ],
    },
    {
      title: "حقوقك",
      titleEn: "Your Rights",
      icon: <Shield color="info" />,
      items: [
        "الوصول إلى معلوماتك الشخصية",
        "تصحيح أو تحديث معلوماتك",
        "طلب حذف حسابك",
        "إلغاء الاشتراك في الرسائل التسويقية",
        "نقل بياناتك (حسب القانون المعمول به)",
      ],
      itemsEn: [
        "Access to your personal information",
        "Correct or update your information",
        "Request deletion of your account",
        "Unsubscribe from marketing messages",
        "Data portability (as per applicable law)",
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
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Security sx={{ fontSize: 48, mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontSize: "1.1rem" }}>
            {isRTL
              ? "نحن ملتزمون بحماية خصوصيتك وأمان معلوماتك الشخصية"
              : "We are committed to protecting your privacy and the security of your personal information"}
          </Typography>
        </Paper>

        {/* Overview */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
            {isRTL ? "نظرة عامة" : "Overview"}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 2 }}>
            {isRTL
              ? "في منصة الجناح، نقدر ثقتك ونلتزم بحماية خصوصيتك. تشرح هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها لنا عند استخدام خدماتنا."
              : "At Al Janah platform, we value your trust and are committed to protecting your privacy. This policy explains how we collect, use, and protect the personal information you provide when using our services."}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
            {isRTL
              ? "نتبع أفضل الممارسات العالمية في حماية البيانات ونلتزم بالقوانين المحلية والدولية المعمول بها."
              : "We follow global best practices in data protection and comply with applicable local and international laws."}
          </Typography>
        </Paper>

        {/* Privacy Sections */}
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
                        label="•"
                        size="small"
                        color="primary"
                        sx={{
                          minWidth: 24,
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
          </Paper>
        ))}

        {/* Additional Information */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "primary.50",
                border: 1,
                borderColor: "primary.200",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}
              >
                {isRTL ? "الاحتفاظ بالبيانات" : "Data Retention"}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {isRTL
                  ? "نحتفظ بمعلوماتك الشخصية طالما كان حسابك نشطاً أو حسب الحاجة لتقديم الخدمات. يمكنك طلب حذف حسابك في أي وقت."
                  : "We retain your personal information as long as your account is active or as needed to provide services. You can request account deletion at any time."}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "success.50",
                border: 1,
                borderColor: "success.200",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "success.main" }}
              >
                {isRTL ? "ملفات تعريف الارتباط" : "Cookies"}
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {isRTL
                  ? "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من متصفحك."
                  : "We use cookies to improve your experience and remember your preferences. You can control cookie settings through your browser."}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Contact Information */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            bgcolor: "warning.50",
            border: 1,
            borderColor: "warning.200",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 2, color: "warning.main" }}
          >
            {isRTL ? "تواصل معنا" : "Contact Us"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {isRTL
              ? "إذا كان لديك أي أسئلة حول سياسة الخصوصية أو ترغب في ممارسة حقوقك، يرجى الاتصال بنا:"
              : "If you have any questions about this privacy policy or wish to exercise your rights, please contact us:"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body1">
              <strong>{isRTL ? "الهاتف:" : "Phone:"} +964 773 300 2076</strong>
            </Typography>
            <Typography variant="body1">
              <strong>
                {isRTL ? "البريد الإلكتروني:" : "Email:"} privacy@janah.com
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
