// /app/business-owners/[id]/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import MobileBusinessOwnerDetail from "@/components/mobile/owners/BusinessOwnerDetail";
import DesktopBusinessOwnerDetail from "@/components/desktop/owners/BusinessOwnerDetail";

/**
 * Business Owner Detail Page Component
 * 
 * This component serves as a responsive wrapper that renders either the mobile or desktop
 * version of the business owner detail page based on the user's screen size.
 * 
 * @param {Object} params - Contains the business owner ID from the route
 */
const BusinessOwnerDetailPage = ({ params }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [mounted, setMounted] = useState(false);
  
  // Fix for hydration mismatch - ensure component is only rendered client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract the business owner ID from the route params
  const { id } = params;
  
  // Don't render until after client-side hydration to prevent mismatch
  if (!mounted) return null;

  // Render either the mobile or desktop version based on screen size
  return isDesktop ? (
    <DesktopBusinessOwnerDetail id={id} />
  ) : (
    <MobileBusinessOwnerDetail id={id} />
  );
};

export default BusinessOwnerDetailPage;
