import React from "react";
import { IconButton, Menu, MenuItem, Box, Typography } from "@mui/material";
import { Language, Check } from "@mui/icons-material";
import { useTranslation } from "@/hooks/useTranslation";

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language: "en" | "ar") => {
    changeLanguage(language);
    handleClose();
  };

  const languages = [
    {
      code: "en",
      name: t("language.english", "English"),
      nativeName: "English",
    },
    {
      code: "ar",
      name: t("language.arabic", "Arabic"),
      nativeName: "العربية",
    },
  ];

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Language />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code as "en" | "ar")}
            selected={currentLanguage === language.code}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 120,
              }}
            >
              <Typography variant="body2">{language.nativeName}</Typography>
              {currentLanguage === language.code && (
                <Check
                  sx={{ ml: "auto", fontSize: 16, color: "primary.main" }}
                />
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
