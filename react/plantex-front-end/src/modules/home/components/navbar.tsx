import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/navbar";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const navItems = [
  {
    name: "Visualize imagens no google Drive",
    link: "https://drive.google.com/drive/folders/1Ohlhzbd3cH3ik8SrAGO4IV8xJebl5d__",
  },
];

export function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const eletricalSchematicLink = useMemo(
    () => (
      <div className="flex items-center gap-x-2 z-30">
        <ModeToggle />
        <motion.button
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className="cursor-pointer z-30 rounded-md bg-none py-2 px-4"
        >
          <p className="text-sm light:text-black dark:text-white font-bold">
            Projeto
          </p>
        </motion.button>
      </div>
    ),
    []
  );

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          {eletricalSchematicLink}
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="flex items-center w-full"
          >
            {eletricalSchematicLink}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
