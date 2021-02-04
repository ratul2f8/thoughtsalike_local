import React from "react";
import { useColorMode, IconButton } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <IconButton
      aria-label="color mode seitcher"
      color={isDark && "darkblue"}
      colorScheme={isDark && "yellow"}
      icon={!isDark ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
    />
  );
};

