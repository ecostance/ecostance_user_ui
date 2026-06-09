import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Card, Button, Alert, Badge, Spinner, OverlayTrigger, Popover } from "react-bootstrap";
import { LayoutTwo } from "../../../components/Layout";
import { BreadcrumbOne } from "../../../components/Breadcrumb";
import Head from "next/head";
import { useToasts } from "react-toast-notifications";
import { FaCreditCard, FaDownload, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaBriefcase, FaUsers, FaCalendar, FaIdCard, FaTruck, FaCog, FaMinus, FaPlus, FaList, FaTh, FaUser, FaEnvelope, FaBuilding, FaUserTie, FaInfoCircle } from "react-icons/fa";
import { getPricingLinkById } from "../../../apiClient/pricingLinks";
import jsPDF from "jspdf";

// Module icons mapping
const MODULE_ICONS = {
  1: FaBriefcase,  // Business Account
  2: FaUsers,      // Employee Account
  3: FaCalendar,   // Event Page
  4: FaIdCard,     // Digital Passport Page
  5: FaTruck       // Supply Chain
};

const PricingReview = () => {
  const { addToast } = useToasts();
  const router = useRouter();
  const { linkId } = router.query;

  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState(null);
  const [linkStatus, setLinkStatus] = useState(null);
  const [linkExpiresAt, setLinkExpiresAt] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState("full"); // "full" or "monthly"
  const [moduleViewType, setModuleViewType] = useState("list"); // "grid" or "list"

  useEffect(() => {
    if (linkId) {
      loadPricingData();
    }
  }, [linkId]);

  const loadPricingData = async () => {
    try {
      setLoading(true);
      // Fetch pricing data from backend API using linkId
      const response = await getPricingLinkById(linkId);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Invalid response data");
      }

      const linkData = response.data.data;

      // Store link status and expiration
      setLinkStatus(linkData.status);
      setLinkExpiresAt(linkData.expiresAt);

      // Extract the pricing data (userInfo, modules, etc.)
      setPricingData({
        userInfo: linkData.userInfo,
        customPrices: linkData.customPrices,
        enabledModules: linkData.enabledModules,
        modules: linkData.modules,
        generatedAt: linkData.generatedAt || linkData.createdAt,
        baseTotals: linkData.baseTotals,
        oneTimeFee: linkData.oneTimeFee || 0,
        discount: linkData.discount || 0,
        discountType: linkData.discountType || "percentage",
        paymentPlan: linkData.paymentPlan || "full",
        minUnits: linkData.minUnits || 5
      });

      // Set the payment plan from saved data
      if (linkData.paymentPlan) {
        setSelectedPaymentPlan(linkData.paymentPlan);
      }

      // Initialize quantities from admin-configured additional units
      // Read from customPrices object which has complete data
      const initialQuantities = {};
      (linkData.modules || []).forEach(module => {
        // Use admin's configured additional units (units field) from customPrices
        const customPricing = linkData.customPrices?.[module.id] || module.customPricing || {};
        const adminAddlUnits = customPricing.units || 0;
        initialQuantities[module.id] = adminAddlUnits;
      });
      setQuantities(initialQuantities);

      // Show warning for expired links
      if (linkData.status === "expired") {
        addToast("This pricing quote has expired.", {
          appearance: "warning",
          autoDismiss: false,
        });
      } else if (linkData.status === "used") {
        addToast("This pricing quote has already been used.", {
          appearance: "info",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error loading pricing data:", error);
      addToast("Pricing link not found or has expired.", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatExpirationDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const isLinkExpiredOrUsed = () => {
    return linkStatus === "expired" || linkStatus === "used";
  };

  const getStatusBadge = () => {
    if (!linkStatus) return null;
    const variants = {
      active: "success",
      expired: "warning",
      used: "secondary"
    };
    const labels = {
      active: "Active",
      expired: "Expired",
      used: "Used"
    };
    return <Badge variant={variants[linkStatus] || "info"}>{labels[linkStatus] || linkStatus}</Badge>;
  };

  const handlePayment = async () => {
    setProcessingPayment(true);
    try {
      // All modules are included by default - no validation needed for quantity

      // Prepare pricing data for checkout - all modules are included
      const totals = calculateTotals();
      const selectedModules = pricingData.modules; // All modules included by default

      // Split name into firstName and lastName for form pre-fill
      const nameParts = (pricingData.userInfo.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Store pricing data for checkout page
      // Use quote email for guest checkout - this is the buyer's email entered by admin
      const checkoutData = {
        pricingData,
        quantities, // Additional users per module
        totals,
        selectedModules,
        linkId,
        oneTimeFee: pricingData.oneTimeFee || 0, // Include one-time fee
        discount: pricingData.discount || 0,
        discountType: pricingData.discountType || "percentage",
        discountAmount: totals.discountAmount || 0,
        paymentPlan: selectedPaymentPlan,
        payToday: totals.payToday,
        monthlyAfter: totals.monthlyAfter,
        guestEmail: pricingData.userInfo.email,  // Quote email for guest checkout
        // Buyer info for form pre-fill
        buyerInfo: {
          firstName: firstName,
          lastName: lastName,
          email: pricingData.userInfo.email,
          company: pricingData.userInfo.companyName || ""
        }
      };

      // Store data for checkout page to access
      localStorage.setItem('dynamicPricingCheckout', JSON.stringify(checkoutData));
      sessionStorage.setItem('dynamicPricingCheckout', JSON.stringify(checkoutData));
      // Clear any previous processed flag so checkout page will process fresh data
      sessionStorage.removeItem('processedDynamicPricingLinkId');

      // Navigate to checkout page with module order parameters
      // Address will be collected on checkout page
      const checkoutUrl = `/other/checkout?moduleOrder=true&express=true&dynamicPricing=true&linkId=${linkId}`;
      router.push(checkoutUrl);

    } catch (error) {
      console.error("Payment navigation error:", error);
      addToast("Error navigating to payment. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
      setProcessingPayment(false);
    }
  };

  const handleQuantityChange = (moduleId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [moduleId]: Math.max(0, parseInt(newQuantity) || 0)
    }));
  };

  const calculateTotals = () => {
    if (!pricingData) return {
      totalModulePrice: 0,
      totalMonthlyMaintenance: 0,
      totalMonthlyCost: 0,
      totalIncludedUnits: 0,
      totalAdditionalUnits: 0,
      oneTimeFee: 0,
      grandTotal: 0,
      totalUsers: 0,
      discountValue: 0,
      discountType: "percentage",
      discountAmount: 0,
      payToday: 0,
      monthlyAfter: 0,
      totalMonthlyRecurring: 0
    };

    let totalModulePrice = 0;
    let totalMonthlyMaintenance = 0;
    let totalMonthlyCost = 0;
    let totalIncludedUnits = 0;
    let totalAdditionalUnits = 0;
    let totalUsers = 0;
    const oneTimeFeeAmount = parseFloat(pricingData.oneTimeFee) || 0;
    const discountValue = parseFloat(pricingData.discount) || 0;
    const discountType = pricingData.discountType || "percentage";

    pricingData.modules.forEach(module => {
      const additionalUsers = quantities[module.id] || 0;
      // Use customPrices object as primary source (has complete data including includedUnits)
      const pricing = pricingData.customPrices?.[module.id] || module.customPricing || {};
      const includedUnits = pricing.includedUnits || pricingData.minUnits || 5;
      const totalModuleUsers = includedUnits + additionalUsers;
      // Module price and maintenance are fixed and always included
      totalModulePrice += pricing.modulePrice || 0;
      totalMonthlyMaintenance += pricing.monthlyMaintenance || 0;
      // Monthly cost per user only applies to ADDITIONAL users
      totalMonthlyCost += (pricing.monthlyCostPerUser || 0) * additionalUsers;
      totalIncludedUnits += includedUnits;
      totalAdditionalUnits += additionalUsers;
      totalUsers += totalModuleUsers;
    });

    const totalMonthlyRecurring = totalMonthlyMaintenance + totalMonthlyCost;
    const oneTimeCosts = totalModulePrice + oneTimeFeeAmount;
    const isFullPlan = selectedPaymentPlan === "full";

    // Calculate totals based on payment plan
    let totalBeforeDiscount, discountAmount, payToday, monthlyAfter;

    if (isFullPlan) {
      // Full payment: everything upfront including 12 months of recurring
      totalBeforeDiscount = oneTimeCosts + (totalMonthlyRecurring * 12);
      if (discountType === "percentage") {
        discountAmount = (totalBeforeDiscount * discountValue) / 100;
      } else {
        discountAmount = Math.min(discountValue, totalBeforeDiscount);
      }
      payToday = Math.max(0, totalBeforeDiscount - discountAmount);
      monthlyAfter = 0;
    } else {
      // Monthly payment: one-time costs + 1st month today, then 11 months recurring
      totalBeforeDiscount = oneTimeCosts + totalMonthlyRecurring;
      if (discountType === "percentage") {
        discountAmount = (totalBeforeDiscount * discountValue) / 100;
      } else {
        discountAmount = Math.min(discountValue, totalBeforeDiscount);
      }
      payToday = Math.max(0, totalBeforeDiscount - discountAmount);
      monthlyAfter = totalMonthlyRecurring;
    }

    const remainingMonths = 11; // 1st month included in upfront payment

    return {
      totalModulePrice,
      totalMonthlyMaintenance,
      totalMonthlyCost,
      totalIncludedUnits,
      totalAdditionalUnits,
      oneTimeFee: oneTimeFeeAmount,
      grandTotal: totalBeforeDiscount,
      totalUsers,
      discountValue,
      discountType,
      discountAmount,
      payToday,
      monthlyAfter,
      totalMonthlyRecurring,
      oneTimeCosts,
      isFullPlan,
      remainingMonths
    };
  };

  const downloadQuote = () => {
    const totals = calculateTotals();
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // Helper function to format currency
    const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;

    // Helper function to add a horizontal line
    const addLine = (y, color = [200, 200, 200], width = 0.5) => {
      doc.setDrawColor(...color);
      doc.setLineWidth(width);
      doc.line(margin, y, pageWidth - margin, y);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (neededSpace) => {
      if (yPos + neededSpace > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // ===== PAGE 1: HEADER =====
    doc.setFillColor(51, 51, 51);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("ECOSTANCE", margin, 22);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("CUSTOM PRICING PROPOSAL", margin, 32);

    // Quote reference on the right
    doc.setFontSize(9);
    doc.text(`Quote #: ${linkId?.substring(0, 25) || 'N/A'}`, pageWidth - margin, 18, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageWidth - margin, 26, { align: "right" });
    if (linkExpiresAt) {
      doc.text(`Valid Until: ${new Date(linkExpiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}`, pageWidth - margin, 34, { align: "right" });
    }

    yPos = 55;

    // ===== CLIENT & QUOTE INFORMATION =====
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, yPos, contentWidth, 45, "F");
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, yPos, contentWidth, 45, "S");

    // Left side - Client Info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("PREPARED FOR", margin + 8, yPos + 10);

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(pricingData.userInfo.name || 'N/A', margin + 8, yPos + 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(pricingData.userInfo.email || '', margin + 8, yPos + 28);
    if (pricingData.userInfo.companyName) {
      doc.text(pricingData.userInfo.companyName, margin + 8, yPos + 36);
    }
    if (pricingData.userInfo.role) {
      const roleLabel = pricingData.userInfo.role === "owner_partner" ? "Owner/Partner" : "Employee/Admin";
      doc.text(`Role: ${roleLabel}`, margin + 8, yPos + (pricingData.userInfo.companyName ? 44 : 36));
    }

    // Right side - Quote Summary Box
    const summaryBoxX = pageWidth / 2 + 10;
    doc.setFillColor(51, 51, 51);
    doc.rect(summaryBoxX, yPos + 5, contentWidth / 2 - 15, 35, "F");

    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("AMOUNT DUE TODAY", summaryBoxX + 8, yPos + 15);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(totals.payToday), summaryBoxX + 8, yPos + 30);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("USD", summaryBoxX + doc.getTextWidth(formatCurrency(totals.payToday)) + 12, yPos + 30);

    yPos += 55;

    // ===== SELECTED PAYMENT PLAN =====
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("SELECTED PAYMENT PLAN", margin, yPos);
    yPos += 8;

    const planBoxColor = totals.isFullPlan ? [232, 245, 233] : [227, 242, 253];
    const planBorderColor = totals.isFullPlan ? [200, 230, 201] : [187, 222, 251];
    doc.setFillColor(...planBoxColor);
    doc.setDrawColor(...planBorderColor);
    doc.rect(margin, yPos, contentWidth, 25, "FD");

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(totals.isFullPlan ? "Full Payment" : "12-Month Payment Plan", margin + 8, yPos + 10);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(
      totals.isFullPlan
        ? "Pay everything upfront including 12 months of recurring costs."
        : "Pay setup costs + 1st month today, then monthly recurring for 11 months.",
      margin + 8, yPos + 18
    );

    yPos += 35;

    // ===== MODULE DETAILS TABLE =====
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("MODULE DETAILS", margin, yPos);
    yPos += 8;

    // Table header
    doc.setFillColor(51, 51, 51);
    doc.rect(margin, yPos, contentWidth, 12, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");

    const cols = {
      module: margin + 5,
      setup: margin + 55,
      maint: margin + 85,
      perUser: margin + 115,
      units: margin + 145,
      addl: margin + 162,
      subtotal: pageWidth - margin - 5
    };

    doc.text("MODULE", cols.module, yPos + 8);
    doc.text("SETUP FEE", cols.setup, yPos + 8);
    doc.text("MAINT./MO", cols.maint, yPos + 8);
    doc.text("PER USER/MO", cols.perUser, yPos + 8);
    doc.text("UNITS", cols.units, yPos + 8);
    doc.text("ADD'L", cols.addl, yPos + 8);
    doc.text("SUBTOTAL", cols.subtotal, yPos + 8, { align: "right" });

    yPos += 14;

    // Table rows
    doc.setTextColor(51, 51, 51);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    let moduleData = [];

    pricingData.modules.forEach((module, index) => {
      const additionalUsers = quantities[module.id] || 0;
      const pricing = pricingData.customPrices?.[module.id] || module.customPricing || {};
      const baseUnits = pricing.units || pricingData.minUnits || 5;
      const modulePrice = pricing.modulePrice || 0;
      const maintenancePrice = pricing.monthlyMaintenance || 0;
      const costPerUser = pricing.monthlyCostPerUser || 0;
      const additionalUsersCost = costPerUser * additionalUsers;
      const rowTotal = modulePrice + maintenancePrice + additionalUsersCost;

      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, yPos - 3, contentWidth, 14, "F");
      }

      // Module name
      doc.setFont("helvetica", "bold");
      doc.setTextColor(51, 51, 51);
      const moduleName = module.name.length > 18 ? module.name.substring(0, 16) + "..." : module.name;
      doc.text(moduleName, cols.module, yPos + 5);

      // Values
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(formatCurrency(modulePrice), cols.setup, yPos + 5);
      doc.text(formatCurrency(maintenancePrice), cols.maint, yPos + 5);
      doc.text(formatCurrency(costPerUser), cols.perUser, yPos + 5);
      doc.text(String(baseUnits), cols.units, yPos + 5);
      doc.text(additionalUsers > 0 ? String(additionalUsers) : "-", cols.addl, yPos + 5);

      // Subtotal
      doc.setFont("helvetica", "bold");
      doc.setTextColor(51, 51, 51);
      doc.text(formatCurrency(rowTotal), cols.subtotal, yPos + 5, { align: "right" });

      moduleData.push({
        name: module.name,
        setupFee: modulePrice,
        maintenance: maintenancePrice,
        costPerUser: costPerUser,
        units: baseUnits,
        additionalUsers: additionalUsers,
        subtotal: rowTotal
      });

      yPos += 14;
    });

    // Table bottom border
    addLine(yPos - 2, [51, 51, 51], 1);

    yPos += 10;

    // ===== PRICING BREAKDOWN =====
    checkNewPage(120);

    doc.setTextColor(51, 51, 51);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PRICING BREAKDOWN", margin, yPos);
    yPos += 10;

    const breakdownX = margin + 5;
    const breakdownValueX = pageWidth - margin - 5;

    // One-Time Costs Section
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("ONE-TIME COSTS", breakdownX, yPos + 5.5);
    yPos += 12;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Module Setup Fees
    doc.text(`Module Setup Fees (${pricingData.modules.length} modules)`, breakdownX, yPos);
    doc.text(formatCurrency(totals.totalModulePrice), breakdownValueX, yPos, { align: "right" });
    yPos += 7;

    // One-Time Fee
    if (totals.oneTimeFee > 0) {
      doc.text("Additional One-Time Fee", breakdownX, yPos);
      doc.text(formatCurrency(totals.oneTimeFee), breakdownValueX, yPos, { align: "right" });
      yPos += 7;
    }

    // One-time subtotal
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 51, 51);
    doc.text("Total One-Time Costs", breakdownX, yPos);
    doc.text(formatCurrency(totals.oneTimeCosts), breakdownValueX, yPos, { align: "right" });
    yPos += 12;

    // Monthly Recurring Section
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("MONTHLY RECURRING COSTS", breakdownX, yPos + 5.5);
    yPos += 12;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    // Monthly Maintenance
    doc.text(`Monthly Maintenance (${pricingData.modules.length} modules)`, breakdownX, yPos);
    doc.text(formatCurrency(totals.totalMonthlyMaintenance) + "/mo", breakdownValueX, yPos, { align: "right" });
    yPos += 7;

    // Add'l Units Cost
    if (totals.totalMonthlyCost > 0) {
      doc.text("Add'l Units Cost", breakdownX, yPos);
      doc.text(formatCurrency(totals.totalMonthlyCost) + "/mo", breakdownValueX, yPos, { align: "right" });
      yPos += 7;
    }

    // Monthly subtotal
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 51, 51);
    doc.text("Total Monthly Recurring", breakdownX, yPos);
    doc.text(formatCurrency(totals.totalMonthlyRecurring) + "/mo", breakdownValueX, yPos, { align: "right" });
    yPos += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("(12 months = " + formatCurrency(totals.totalMonthlyRecurring * 12) + ")", breakdownValueX, yPos, { align: "right" });
    yPos += 15;

    // ===== PAYMENT SUMMARY =====
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, yPos, contentWidth, 8, "F");
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(totals.isFullPlan ? "FULL PAYMENT SUMMARY" : "12-MONTH PLAN SUMMARY", breakdownX, yPos + 5.5);
    yPos += 12;

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    if (totals.isFullPlan) {
      // Full Payment breakdown
      doc.text("One-Time Costs", breakdownX, yPos);
      doc.text(formatCurrency(totals.oneTimeCosts), breakdownValueX, yPos, { align: "right" });
      yPos += 7;

      doc.text("12 Months Recurring (" + formatCurrency(totals.totalMonthlyRecurring) + " × 12)", breakdownX, yPos);
      doc.text(formatCurrency(totals.totalMonthlyRecurring * 12), breakdownValueX, yPos, { align: "right" });
      yPos += 7;

      addLine(yPos, [200, 200, 200]);
      yPos += 5;

      doc.setFont("helvetica", "bold");
      doc.text("Subtotal", breakdownX, yPos);
      doc.text(formatCurrency(totals.grandTotal), breakdownValueX, yPos, { align: "right" });
      yPos += 8;

    } else {
      // Monthly Plan breakdown
      doc.text("One-Time Costs (Due Today)", breakdownX, yPos);
      doc.text(formatCurrency(totals.oneTimeCosts), breakdownValueX, yPos, { align: "right" });
      yPos += 7;

      addLine(yPos, [200, 200, 200]);
      yPos += 5;

      doc.setFont("helvetica", "bold");
      doc.text("Subtotal (Due Today)", breakdownX, yPos);
      doc.text(formatCurrency(totals.grandTotal), breakdownValueX, yPos, { align: "right" });
      yPos += 8;
    }

    // Discount
    if (totals.discountAmount > 0) {
      doc.setTextColor(34, 139, 34);
      doc.setFont("helvetica", "normal");
      const discountLabel = totals.discountType === "percentage"
        ? `Discount (${totals.discountValue}%)`
        : "Discount";
      doc.text(discountLabel, breakdownX, yPos);
      doc.text("-" + formatCurrency(totals.discountAmount), breakdownValueX, yPos, { align: "right" });
      yPos += 10;
    }

    // ===== FINAL TOTALS BOX =====
    doc.setFillColor(51, 51, 51);
    doc.rect(margin, yPos, contentWidth, totals.isFullPlan ? 25 : 45, "F");

    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("AMOUNT DUE TODAY", breakdownX, yPos + 8);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(totals.payToday) + " USD", breakdownValueX, yPos + 10, { align: "right" });

    if (totals.discountAmount > 0) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(142, 255, 142);
      doc.text("You save " + formatCurrency(totals.discountAmount), breakdownValueX, yPos + 18, { align: "right" });
    }

    if (!totals.isFullPlan && totals.monthlyAfter > 0) {
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("THEN MONTHLY (×12)", breakdownX, yPos + 28);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(formatCurrency(totals.monthlyAfter) + "/mo", breakdownValueX, yPos + 30, { align: "right" });

      doc.setTextColor(180, 180, 180);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Total over " + totals.remainingMonths + " months: " + formatCurrency(totals.payToday + (totals.monthlyAfter * totals.remainingMonths)), breakdownValueX, yPos + 40, { align: "right" });
    }

    yPos += totals.isFullPlan ? 35 : 55;

    // ===== PAYMENT OPTIONS COMPARISON (if space allows) =====
    if (yPos < pageHeight - 80) {
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("PAYMENT OPTIONS COMPARISON", margin, yPos);
      yPos += 8;

      // Calculate both options
      const fullPaymentTotal = totals.oneTimeCosts + (totals.totalMonthlyRecurring * 12);
      let fullDiscount = 0;
      if (totals.discountType === "percentage") {
        fullDiscount = (fullPaymentTotal * totals.discountValue) / 100;
      } else {
        fullDiscount = Math.min(totals.discountValue, fullPaymentTotal);
      }
      const fullPayToday = Math.max(0, fullPaymentTotal - fullDiscount);

      const monthlyPaymentUpfront = totals.oneTimeCosts + totals.totalMonthlyRecurring; // includes 1st month
      let monthlyDiscount = 0;
      if (totals.discountType === "percentage") {
        monthlyDiscount = (monthlyPaymentUpfront * totals.discountValue) / 100;
      } else {
        monthlyDiscount = Math.min(totals.discountValue, monthlyPaymentUpfront);
      }
      const monthlyPayToday = Math.max(0, monthlyPaymentUpfront - monthlyDiscount);
      const monthlyGrandTotal = monthlyPayToday + (totals.totalMonthlyRecurring * totals.remainingMonths);

      // Option boxes
      const boxWidth = (contentWidth - 10) / 2;

      // Full Payment Option
      doc.setFillColor(...(totals.isFullPlan ? [232, 245, 233] : [250, 250, 250]));
      doc.setDrawColor(...(totals.isFullPlan ? [76, 175, 80] : [200, 200, 200]));
      doc.setLineWidth(totals.isFullPlan ? 1 : 0.5);
      doc.rect(margin, yPos, boxWidth, 40, "FD");

      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("OPTION 1: FULL PAYMENT", margin + 5, yPos + 10);
      if (totals.isFullPlan) {
        doc.setTextColor(76, 175, 80);
        doc.text("✓ SELECTED", margin + boxWidth - 5, yPos + 10, { align: "right" });
      }

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Pay today: " + formatCurrency(fullPayToday), margin + 5, yPos + 20);
      doc.text("Then monthly: $0.00", margin + 5, yPos + 27);
      doc.setFont("helvetica", "bold");
      doc.text("Total: " + formatCurrency(fullPayToday), margin + 5, yPos + 35);

      // Monthly Payment Option
      doc.setFillColor(...(!totals.isFullPlan ? [227, 242, 253] : [250, 250, 250]));
      doc.setDrawColor(...(!totals.isFullPlan ? [33, 150, 243] : [200, 200, 200]));
      doc.setLineWidth(!totals.isFullPlan ? 1 : 0.5);
      doc.rect(margin + boxWidth + 10, yPos, boxWidth, 40, "FD");

      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("OPTION 2: MONTHLY PLAN", margin + boxWidth + 15, yPos + 10);
      if (!totals.isFullPlan) {
        doc.setTextColor(33, 150, 243);
        doc.text("✓ SELECTED", pageWidth - margin - 5, yPos + 10, { align: "right" });
      }

      doc.setTextColor(80, 80, 80);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Pay today (incl. 1st mo): " + formatCurrency(monthlyPayToday), margin + boxWidth + 15, yPos + 20);
      doc.text("Then monthly: " + formatCurrency(totals.totalMonthlyRecurring) + " × " + totals.remainingMonths, margin + boxWidth + 15, yPos + 27);
      doc.setFont("helvetica", "bold");
      doc.text("Total: " + formatCurrency(monthlyGrandTotal), margin + boxWidth + 15, yPos + 35);

      yPos += 50;
    }

    // ===== TERMS & NOTES =====
    if (yPos < pageHeight - 50) {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("TERMS & CONDITIONS", margin, yPos);
      yPos += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      const terms = [
        "• This quote is valid until the expiration date shown above.",
        "• Prices are in USD and exclude applicable taxes.",
        "• Monthly recurring charges are billed at the start of each billing cycle.",
        "• Additional users can be added at any time at the per-user rate shown.",
        "• Base units are included in the module setup fee."
      ];
      terms.forEach(term => {
        if (yPos < pageHeight - 20) {
          doc.text(term, margin, yPos);
          yPos += 5;
        }
      });
    }

    // ===== FOOTER =====
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by EcoStance | www.ecostance.com | support@ecostance.com", pageWidth / 2, pageHeight - 12, { align: "center" });
    doc.text(`Quote ID: ${linkId} | Page 1 of 1`, pageWidth / 2, pageHeight - 7, { align: "center" });

    // Save the PDF
    doc.save(`EcoStance-Pricing-Quote-${linkId}.pdf`);

    addToast("Quote PDF downloaded successfully!", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  if (loading) {
    return (
      <LayoutTwo>
        <Head>
          <title>Loading Pricing Review - ECOSTANCE</title>
        </Head>
        <div className="pricing-review-wrapper" style={{ padding: '100px 0' }}>
          <Container>
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <Spinner animation="border" role="status" style={{ color: '#333' }}>
                  <span className="sr-only">Loading...</span>
                </Spinner>
                <p className="mt-3" style={{ color: '#666' }}>Loading pricing information...</p>
              </Col>
            </Row>
          </Container>
        </div>
      </LayoutTwo>
    );
  }

  if (!pricingData) {
    return (
      <LayoutTwo>
        <Head>
          <title>Pricing Link Not Found - ECOSTANCE</title>
        </Head>
        <div className="pricing-review-wrapper" style={{ padding: '100px 0' }}>
          <Container>
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <div style={{ background: '#f8f8f8', border: '1px solid #d6d6d6', padding: '40px' }}>
                  <h4 style={{ color: '#333', marginBottom: '15px' }}>Pricing Link Not Found</h4>
                  <p style={{ color: '#666', marginBottom: '20px' }}>The pricing link you're looking for doesn't exist or has expired.</p>
                  <button
                    onClick={() => router.push('/')}
                    style={{
                      padding: '12px 30px',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      background: '#333',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Homepage
                  </button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </LayoutTwo>
    );
  }

  const totals = calculateTotals();

  return (
    <LayoutTwo>
      <Head>
        <title>Custom Pricing Proposal - ECOSTANCE</title>
      </Head>

      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Custom Pricing Proposal"
        className="bg--3"
      >
        <ul className="breadcrumb__list">
          <li>
            <a href="/">Home</a>
          </li>
          <li>Pricing Proposal</li>
        </ul>
      </BreadcrumbOne>

      <div className="pricing-review-wrapper" style={{ padding: '50px 0' }}>
        <Container>
          {/* Header */}
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5">
                <h2 style={{ fontWeight: '500', color: '#333', marginBottom: '10px' }}>Custom Pricing Proposal</h2>
                <p style={{ color: '#777', fontSize: '15px', maxWidth: '600px', margin: '0 auto' }}>
                  Review your personalized pricing below. You can add additional users to each module as needed.
                </p>

                {/* Expired/Used Link Warning */}
                {linkStatus === "expired" && (
                  <div style={{
                    background: '#fff3cd',
                    border: '1px solid #ffc107',
                    padding: '15px 20px',
                    maxWidth: '600px',
                    margin: '20px auto 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <FaExclamationTriangle style={{ color: '#856404' }} />
                    <span style={{ color: '#856404' }}><strong>This quote has expired.</strong> Please contact us for a new quote.</span>
                  </div>
                )}

                {linkStatus === "used" && (
                  <div style={{
                    background: '#e2e3e5',
                    border: '1px solid #6c757d',
                    padding: '15px 20px',
                    maxWidth: '600px',
                    margin: '20px auto 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <FaCheckCircle style={{ color: '#495057' }} />
                    <span style={{ color: '#495057' }}><strong>This quote has already been used.</strong></span>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Main Content */}
          <div style={{ display: 'grid', gap: '24px' }}>

            {/* Section 1: Quote Information */}
            <div style={{ background: '#f8f8f8', padding: '30px', border: '1px solid #d6d6d6' }}>
              <div style={{ marginBottom: '25px', borderBottom: '1px solid #d6d6d6', paddingBottom: '15px' }}>
                <h5 style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#333'
                }}>
                  Quote Information
                </h5>
              </div>

              <Row>
                <Col md={3}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#777',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaUser style={{ fontSize: '12px' }} /> Prepared For
                    </div>
                    <div style={{ fontSize: '15px', color: '#333', fontWeight: '500' }}>{pricingData.userInfo.name}</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#777',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaEnvelope style={{ fontSize: '12px' }} /> Email
                    </div>
                    <div style={{ fontSize: '15px', color: '#333' }}>{pricingData.userInfo.email}</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#777',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaBuilding style={{ fontSize: '12px' }} /> Company
                    </div>
                    <div style={{ fontSize: '15px', color: '#333' }}>{pricingData.userInfo.companyName || '-'}</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#777',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaCalendarAlt style={{ fontSize: '12px' }} /> Quote Status
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {getStatusBadge()}
                      {linkExpiresAt && (
                        <span style={{ fontSize: '13px', color: linkStatus === 'expired' ? '#dc3545' : '#666' }}>
                          {linkStatus === 'expired' ? 'Expired' : 'Valid until'}: {new Date(linkExpiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Section 2: Module Pricing */}
            <div style={{ background: '#fff', padding: '30px', border: '1px solid #d6d6d6' }}>
              <div style={{ marginBottom: '25px', borderBottom: '1px solid #d6d6d6', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#333'
                }}>
                  Module Pricing
                </h5>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    type="button"
                    onClick={() => setModuleViewType("list")}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: moduleViewType === "list" ? '2px solid #333' : '1px solid #ccc',
                      background: moduleViewType === "list" ? '#333' : '#fff',
                      color: moduleViewType === "list" ? '#fff' : '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    title="List View"
                  >
                    <FaList style={{ fontSize: '14px' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModuleViewType("grid")}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: moduleViewType === "grid" ? '2px solid #333' : '1px solid #ccc',
                      background: moduleViewType === "grid" ? '#333' : '#fff',
                      color: moduleViewType === "grid" ? '#fff' : '#666',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    title="Grid View"
                  >
                    <FaTh style={{ fontSize: '14px' }} />
                  </button>
                </div>
              </div>

              {/* Module Cards - Grid View */}
              {moduleViewType === "grid" && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '20px'
                }}>
                  {pricingData.modules.map((module) => {
                    const ModuleIcon = MODULE_ICONS[module.id] || FaCog;
                    const additionalUsers = quantities[module.id] || 0;
                    const pricing = pricingData.customPrices?.[module.id] || module.customPricing || {};
                    const includedUnits = pricing.includedUnits || pricingData.minUnits || 5;
                    const modulePrice = pricing.modulePrice || 0;
                    const maintenancePrice = pricing.monthlyMaintenance || 0;
                    const costPerUser = pricing.monthlyCostPerUser || 0;
                    const additionalUsersCost = costPerUser * additionalUsers;
                    const rowTotal = modulePrice + maintenancePrice + additionalUsersCost;

                    return (
                      <div
                        key={module.id}
                        style={{
                          border: additionalUsers > 0 ? '2px solid #333' : '1px solid #d6d6d6',
                          background: '#fff',
                          padding: '24px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {/* Card Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{
                              width: '48px',
                              height: '48px',
                              background: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '20px'
                            }}>
                              <ModuleIcon />
                            </div>
                            <div>
                              <div style={{
                                fontWeight: '500',
                                fontSize: '15px',
                                color: '#333',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                              }}>{module.name}</div>
                              <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>{module.description}</div>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Display */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                          <div>
                            <label style={{
                              fontSize: '11px',
                              fontWeight: '500',
                              color: '#777',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              display: 'block',
                              marginBottom: '8px'
                            }}>
                              Setup Fee
                            </label>
                            <div style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>
                              ${modulePrice.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <label style={{
                              fontSize: '11px',
                              fontWeight: '500',
                              color: '#777',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              display: 'block',
                              marginBottom: '8px'
                            }}>
                              Monthly Maint.
                            </label>
                            <div style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>
                              ${maintenancePrice.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <label style={{
                              fontSize: '11px',
                              fontWeight: '500',
                              color: '#777',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              display: 'block',
                              marginBottom: '8px'
                            }}>
                              Included Units
                            </label>
                            <div style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>
                              {includedUnits}
                            </div>
                          </div>
                          <div>
                            <label style={{
                              fontSize: '11px',
                              fontWeight: '500',
                              color: '#777',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              display: 'block',
                              marginBottom: '8px'
                            }}>
                              Cost/User/Month
                            </label>
                            <div style={{ fontSize: '18px', fontWeight: '500', color: '#333' }}>
                              ${costPerUser.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Add'l Units Input */}
                        <div style={{ background: '#f8f8f8', padding: '15px', marginBottom: '15px' }}>
                          <label style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            color: '#333',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            display: 'block',
                            marginBottom: '10px'
                          }}>
                            Add'l Units
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(module.id, additionalUsers - 1)}
                              disabled={additionalUsers <= 0}
                              style={{
                                width: '40px',
                                height: '40px',
                                border: '2px solid #ccc',
                                borderRight: 'none',
                                background: additionalUsers <= 0 ? '#f5f5f5' : '#fff',
                                cursor: additionalUsers <= 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#333'
                              }}
                            >
                              <FaMinus style={{ fontSize: '10px' }} />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={additionalUsers}
                              onChange={(e) => handleQuantityChange(module.id, e.target.value)}
                              style={{
                                width: '60px',
                                height: '40px',
                                border: '2px solid #ccc',
                                textAlign: 'center',
                                fontSize: '14px',
                                fontWeight: '600'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(module.id, additionalUsers + 1)}
                              style={{
                                width: '40px',
                                height: '40px',
                                border: '2px solid #ccc',
                                borderLeft: 'none',
                                background: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#333'
                              }}
                            >
                              <FaPlus style={{ fontSize: '10px' }} />
                            </button>
                          </div>
                          {additionalUsers > 0 && (
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                              {additionalUsers} × ${costPerUser.toFixed(2)} = ${additionalUsersCost.toFixed(2)}/mo
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* Module Cards - List View */}
              {moduleViewType === "list" && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pricingData.modules.map((module) => {
                    const ModuleIcon = MODULE_ICONS[module.id] || FaCog;
                    const additionalUsers = quantities[module.id] || 0;
                    const pricing = pricingData.customPrices?.[module.id] || module.customPricing || {};
                    const includedUnits = pricing.includedUnits || pricingData.minUnits || 5;
                    const modulePrice = pricing.modulePrice || 0;
                    const maintenancePrice = pricing.monthlyMaintenance || 0;
                    const costPerUser = pricing.monthlyCostPerUser || 0;
                    const additionalUsersCost = costPerUser * additionalUsers;
                    const rowTotal = modulePrice + maintenancePrice + additionalUsersCost;

                    return (
                      <div
                        key={module.id}
                        style={{
                          border: additionalUsers > 0 ? '2px solid #333' : '1px solid #d6d6d6',
                          background: '#fff',
                          padding: '20px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                          {/* Module Info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '0 0 250px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              background: '#333',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '16px',
                              flexShrink: 0
                            }}>
                              <ModuleIcon />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{
                                fontWeight: '500',
                                fontSize: '14px',
                                color: '#333',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase'
                              }}>{module.name}</div>
                              <div style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>{module.description}</div>
                            </div>
                          </div>

                          {/* Pricing Info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                            <div style={{ textAlign: 'center', minWidth: '80px' }}>
                              <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Setup</div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>${modulePrice.toFixed(2)}</div>
                            </div>
                            <div style={{ textAlign: 'center', minWidth: '80px' }}>
                              <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Maint.</div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>${maintenancePrice.toFixed(2)}/mo</div>
                            </div>
                            <div style={{ textAlign: 'center', minWidth: '60px' }}>
                              <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Included</div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{includedUnits}</div>
                            </div>
                            <div style={{ textAlign: 'center', minWidth: '80px' }}>
                              <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Per User</div>
                              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>${costPerUser.toFixed(2)}/mo</div>
                            </div>

                            {/* Add'l Units Input */}
                            <div style={{ minWidth: '120px' }}>
                              <div style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px', textAlign: 'center' }}>Add'l Units</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(module.id, additionalUsers - 1)}
                                  disabled={additionalUsers <= 0}
                                  style={{
                                    width: '32px',
                                    height: '34px',
                                    border: '1px solid #ccc',
                                    borderRight: 'none',
                                    background: additionalUsers <= 0 ? '#f5f5f5' : '#fff',
                                    cursor: additionalUsers <= 0 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#333'
                                  }}
                                >
                                  <FaMinus style={{ fontSize: '9px' }} />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={additionalUsers}
                                  onChange={(e) => handleQuantityChange(module.id, e.target.value)}
                                  style={{
                                    width: '45px',
                                    height: '34px',
                                    border: '1px solid #ccc',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                    fontWeight: '600'
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(module.id, additionalUsers + 1)}
                                  style={{
                                    width: '32px',
                                    height: '34px',
                                    border: '1px solid #ccc',
                                    borderLeft: 'none',
                                    background: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#333'
                                  }}
                                >
                                  <FaPlus style={{ fontSize: '9px' }} />
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 3: Pricing Summary */}
            <div style={{ background: '#f8f8f8', padding: '30px', border: '1px solid #d6d6d6' }}>
              <div style={{ marginBottom: '25px', borderBottom: '1px solid #d6d6d6', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <h5 style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#333'
                }}>
                  Pricing Summary
                </h5>
                {/* Payment Plan Toggle */}
                <div style={{ display: 'flex', border: '1px solid #ccc', background: '#fff' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentPlan("full")}
                    style={{
                      padding: '10px 20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: 'none',
                      background: selectedPaymentPlan === "full" ? '#333' : '#fff',
                      color: selectedPaymentPlan === "full" ? '#fff' : '#666',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Pay Full Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentPlan("monthly")}
                    style={{
                      padding: '10px 20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: 'none',
                      borderLeft: '1px solid #ccc',
                      background: selectedPaymentPlan === "monthly" ? '#333' : '#fff',
                      color: selectedPaymentPlan === "monthly" ? '#fff' : '#666',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    12-Month Plan
                  </button>
                </div>
              </div>

              {(() => {
                const enabledCount = pricingData.modules.length;
                const isFullPlan = selectedPaymentPlan === "full";

                return (
                  <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                    {/* Left Side - Cost Breakdown */}
                    <div style={{ flex: '1', minWidth: '400px' }}>
                      {/* Payment Plan Description */}
                      <div style={{
                        background: isFullPlan ? '#e8f5e9' : '#e3f2fd',
                        border: isFullPlan ? '1px solid #c8e6c9' : '1px solid #bbdefb',
                        padding: '15px 20px',
                        marginBottom: '15px',
                        borderRadius: '4px'
                      }}>
                        <div style={{ fontWeight: '600', color: '#333', marginBottom: '5px', fontSize: '14px' }}>
                          {isFullPlan ? 'Pay Full Amount Today' : '12-Month Payment Plan'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {isFullPlan
                            ? 'Pay everything upfront including 12 months of recurring costs. Discount applies to total amount.'
                            : 'Pay module setup, one-time fee + 1st month today, then monthly recurring for 11 months. Discount applies to today\'s payment.'}
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div style={{ background: '#fff', border: '1px solid #d6d6d6', marginBottom: '15px' }}>
                        <div style={{
                          padding: '12px 20px',
                          borderBottom: '1px solid #d6d6d6',
                          background: '#fafafa',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          color: '#555'
                        }}>
                          {isFullPlan ? 'Full Payment Breakdown' : 'Today\'s Payment Breakdown'}
                        </div>
                        <div style={{ padding: '15px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ color: '#666', fontSize: '14px' }}>Module Setup ({enabledCount} modules)</span>
                            <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>${totals.totalModulePrice.toFixed(2)}</span>
                          </div>
                          {totals.oneTimeFee > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ color: '#666', fontSize: '14px' }}>One-Time Fee</span>
                              <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>${totals.oneTimeFee.toFixed(2)}</span>
                            </div>
                          )}
                          {!isFullPlan && totals.totalMonthlyRecurring > 0 && (
                            <div style={{
                              borderTop: '1px dashed #ddd',
                              marginTop: '10px',
                              paddingTop: '10px',
                              marginBottom: '10px'
                            }}>
                              <div style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                1st Month Recurring
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <span style={{ color: '#666', fontSize: '13px', paddingLeft: '10px' }}>
                                  Base Maintenance
                                </span>
                                <span style={{ color: '#666', fontSize: '13px' }}>${totals.totalMonthlyMaintenance.toFixed(2)}</span>
                              </div>
                              {totals.totalAdditionalUnits > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                  <span style={{ color: '#666', fontSize: '13px', paddingLeft: '10px' }}>
                                    Add'l Units ({totals.totalAdditionalUnits})
                                  </span>
                                  <span style={{ color: '#666', fontSize: '13px' }}>${totals.totalMonthlyCost.toFixed(2)}</span>
                                </div>
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px dotted #ddd' }}>
                                <span style={{ color: '#333', fontSize: '13px', fontWeight: '500', paddingLeft: '10px' }}>1st Month Total</span>
                                <span style={{ color: '#333', fontSize: '13px', fontWeight: '500' }}>${totals.totalMonthlyRecurring.toFixed(2)}</span>
                              </div>
                            </div>
                          )}
                          {isFullPlan && totals.totalMonthlyRecurring > 0 && (
                            <>
                              <div style={{
                                borderTop: '1px dashed #ddd',
                                marginTop: '10px',
                                paddingTop: '10px',
                                marginBottom: '10px'
                              }}>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  12 Months Recurring
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                  <span style={{ color: '#666', fontSize: '13px', paddingLeft: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    Base Maintenance ({totals.totalIncludedUnits} included units)
                                    <OverlayTrigger
                                      trigger="click"
                                      placement="right"
                                      rootClose
                                      overlay={
                                        <Popover id="base-maintenance-breakdown-full-review" style={{ maxWidth: '320px' }}>
                                          <Popover.Title as="div" style={{
                                            background: '#333',
                                            color: '#fff',
                                            padding: '10px 15px',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                          }}>
                                            Base Maintenance Breakdown
                                          </Popover.Title>
                                          <Popover.Content style={{ padding: '12px 15px' }}>
                                            {pricingData.modules.map(module => {
                                              const pricing = pricingData.customPrices?.[module.id] || module.customPricing || {};
                                              const maintenance = pricing.monthlyMaintenance || 0;
                                              const includedUnits = pricing.includedUnits || pricingData.minUnits || 5;
                                              if (maintenance === 0) return null;
                                              return (
                                                <div key={module.id} style={{
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  alignItems: 'center',
                                                  padding: '6px 0',
                                                  borderBottom: '1px solid #eee',
                                                  fontSize: '12px'
                                                }}>
                                                  <span style={{ color: '#555', flex: 1 }}>{module.name}</span>
                                                  <span style={{ color: '#888', marginRight: '10px' }}>({includedUnits} units)</span>
                                                  <span style={{ color: '#333', fontWeight: '500' }}>${maintenance.toFixed(2)}</span>
                                                </div>
                                              );
                                            })}
                                            <div style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              alignItems: 'center',
                                              padding: '8px 0 0',
                                              marginTop: '6px',
                                              borderTop: '2px solid #333',
                                              fontSize: '12px',
                                              fontWeight: '600'
                                            }}>
                                              <span>Total ({totals.totalIncludedUnits} units)</span>
                                              <span>${totals.totalMonthlyMaintenance.toFixed(2)}/mo</span>
                                            </div>
                                          </Popover.Content>
                                        </Popover>
                                      }
                                    >
                                      <span style={{ cursor: 'pointer', color: '#999' }}>
                                        <FaInfoCircle size={12} />
                                      </span>
                                    </OverlayTrigger>
                                  </span>
                                  <span style={{ color: '#666', fontSize: '13px' }}>${totals.totalMonthlyMaintenance.toFixed(2)}/mo</span>
                                </div>
                                {totals.totalAdditionalUnits > 0 && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ color: '#666', fontSize: '13px', paddingLeft: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      Add'l Units ({totals.totalAdditionalUnits})
                                      <OverlayTrigger
                                        trigger="click"
                                        placement="right"
                                        rootClose
                                        overlay={
                                          <Popover id="addl-units-breakdown-full-review" style={{ maxWidth: '320px' }}>
                                            <Popover.Title as="div" style={{
                                              background: '#333',
                                              color: '#fff',
                                              padding: '10px 15px',
                                              fontSize: '11px',
                                              fontWeight: '600',
                                              textTransform: 'uppercase',
                                              letterSpacing: '0.5px'
                                            }}>
                                              Add'l Units Breakdown
                                            </Popover.Title>
                                            <Popover.Content style={{ padding: '12px 15px' }}>
                                              {pricingData.modules.map(module => {
                                                const addlUnits = quantities[module.id] || 0;
                                                const pricing = pricingData.customPrices?.[module.id] || module.customPricing || {};
                                                const costPerUser = pricing.monthlyCostPerUser || 0;
                                                const moduleCost = addlUnits * costPerUser;
                                                if (addlUnits === 0) return null;
                                                return (
                                                  <div key={module.id} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '8px',
                                                    fontSize: '12px',
                                                    color: '#555'
                                                  }}>
                                                    <span style={{ flex: 1, marginRight: '10px' }}>{module.name}</span>
                                                    <span style={{ color: '#777', whiteSpace: 'nowrap' }}>
                                                      {addlUnits} × ${costPerUser.toFixed(2)} = <strong style={{ color: '#333' }}>${moduleCost.toFixed(2)}</strong>
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                              <div style={{
                                                borderTop: '1px solid #ddd',
                                                marginTop: '8px',
                                                paddingTop: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#333'
                                              }}>
                                                <span>Total</span>
                                                <span>${totals.totalMonthlyCost.toFixed(2)}/mo</span>
                                              </div>
                                            </Popover.Content>
                                          </Popover>
                                        }
                                      >
                                        <span style={{ cursor: 'pointer', color: '#999', display: 'inline-flex', alignItems: 'center' }}>
                                          <FaInfoCircle style={{ fontSize: '11px' }} />
                                        </span>
                                      </OverlayTrigger>
                                    </span>
                                    <span style={{ color: '#666', fontSize: '13px' }}>${totals.totalMonthlyCost.toFixed(2)}/mo</span>
                                  </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                  <span style={{ color: '#333', fontSize: '14px', fontWeight: '500', paddingLeft: '10px' }}>
                                    Total (${totals.totalMonthlyRecurring.toFixed(2)} × 12 months)
                                  </span>
                                  <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>${(totals.totalMonthlyRecurring * 12).toFixed(2)}</span>
                                </div>
                              </div>
                            </>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #ddd' }}>
                            <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>Subtotal</span>
                            <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>${totals.grandTotal.toFixed(2)}</span>
                          </div>
                          {totals.discountAmount > 0 && (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <span style={{ color: '#28a745', fontSize: '14px' }}>
                                  Discount {totals.discountType === "percentage" ? `(${totals.discountValue}%)` : ''}
                                </span>
                                <span style={{ color: '#28a745', fontSize: '14px', fontWeight: '500' }}>-${totals.discountAmount.toFixed(2)}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
                                <span style={{ color: '#333', fontSize: '15px', fontWeight: '600' }}>Total</span>
                                <span style={{ color: '#333', fontSize: '15px', fontWeight: '600' }}>${totals.payToday.toFixed(2)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Monthly Recurring (only for monthly plan) */}
                      {!isFullPlan && totals.totalMonthlyRecurring > 0 && (
                        <div style={{ background: '#fff', border: '1px solid #d6d6d6' }}>
                          <div style={{
                            padding: '12px 20px',
                            borderBottom: '1px solid #d6d6d6',
                            background: '#fafafa',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#555'
                          }}>
                            Monthly Recurring ({totals.remainingMonths} Months)
                          </div>
                          <div style={{ padding: '15px 20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <span style={{ color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                Base Maintenance ({totals.totalIncludedUnits} included units)
                                <OverlayTrigger
                                  trigger="click"
                                  placement="right"
                                  rootClose
                                  overlay={
                                    <Popover id="base-maintenance-breakdown-monthly-review" style={{ maxWidth: '320px' }}>
                                      <Popover.Title as="div" style={{
                                        background: '#333',
                                        color: '#fff',
                                        padding: '10px 15px',
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                      }}>
                                        Base Maintenance Breakdown
                                      </Popover.Title>
                                      <Popover.Content style={{ padding: '12px 15px' }}>
                                        {pricingData.modules.map(module => {
                                          const pricing = pricingData.customPrices?.[module.id] || module.customPricing || {};
                                          const maintenance = pricing.monthlyMaintenance || 0;
                                          const includedUnits = pricing.includedUnits || pricingData.minUnits || 5;
                                          if (maintenance === 0) return null;
                                          return (
                                            <div key={module.id} style={{
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              alignItems: 'center',
                                              padding: '6px 0',
                                              borderBottom: '1px solid #eee',
                                              fontSize: '12px'
                                            }}>
                                              <span style={{ color: '#555', flex: 1 }}>{module.name}</span>
                                              <span style={{ color: '#888', marginRight: '10px' }}>({includedUnits} units)</span>
                                              <span style={{ color: '#333', fontWeight: '500' }}>${maintenance.toFixed(2)}</span>
                                            </div>
                                          );
                                        })}
                                        <div style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          padding: '8px 0 0',
                                          marginTop: '6px',
                                          borderTop: '2px solid #333',
                                          fontSize: '12px',
                                          fontWeight: '600'
                                        }}>
                                          <span>Total ({totals.totalIncludedUnits} units)</span>
                                          <span>${totals.totalMonthlyMaintenance.toFixed(2)}/mo</span>
                                        </div>
                                      </Popover.Content>
                                    </Popover>
                                  }
                                >
                                  <span style={{ cursor: 'pointer', color: '#999' }}>
                                    <FaInfoCircle size={12} />
                                  </span>
                                </OverlayTrigger>
                              </span>
                              <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>${totals.totalMonthlyMaintenance.toFixed(2)}/mo</span>
                            </div>
                            {totals.totalAdditionalUnits > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  Add'l Units ({totals.totalAdditionalUnits})
                                  <OverlayTrigger
                                    trigger="click"
                                    placement="right"
                                    rootClose
                                    overlay={
                                      <Popover id="addl-units-breakdown-monthly-review" style={{ maxWidth: '320px' }}>
                                        <Popover.Title as="div" style={{
                                          background: '#333',
                                          color: '#fff',
                                          padding: '10px 15px',
                                          fontSize: '11px',
                                          fontWeight: '600',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.5px'
                                        }}>
                                          Add'l Units Breakdown
                                        </Popover.Title>
                                        <Popover.Content style={{ padding: '12px 15px' }}>
                                          {pricingData.modules.map(module => {
                                            const addlUnits = quantities[module.id] || 0;
                                            const pricing = pricingData.customPrices?.[module.id] || module.customPricing || {};
                                            const costPerUser = pricing.monthlyCostPerUser || 0;
                                            const moduleCost = addlUnits * costPerUser;
                                            if (addlUnits === 0) return null;
                                            return (
                                              <div key={module.id} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '8px',
                                                fontSize: '12px',
                                                color: '#555'
                                              }}>
                                                <span style={{ flex: 1, marginRight: '10px' }}>{module.name}</span>
                                                <span style={{ color: '#777', whiteSpace: 'nowrap' }}>
                                                  {addlUnits} × ${costPerUser.toFixed(2)} = <strong style={{ color: '#333' }}>${moduleCost.toFixed(2)}</strong>
                                                </span>
                                              </div>
                                            );
                                          })}
                                          <div style={{
                                            borderTop: '1px solid #ddd',
                                            marginTop: '8px',
                                            paddingTop: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: '#333'
                                          }}>
                                            <span>Total</span>
                                            <span>${totals.totalMonthlyCost.toFixed(2)}/mo</span>
                                          </div>
                                        </Popover.Content>
                                      </Popover>
                                    }
                                  >
                                    <span style={{ cursor: 'pointer', color: '#999', display: 'inline-flex', alignItems: 'center' }}>
                                      <FaInfoCircle style={{ fontSize: '12px' }} />
                                    </span>
                                  </OverlayTrigger>
                                </span>
                                <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>${totals.totalMonthlyCost.toFixed(2)}/mo</span>
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #ddd' }}>
                              <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>Monthly Payment</span>
                              <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>${totals.totalMonthlyRecurring.toFixed(2)}/mo</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', color: '#666', fontSize: '13px' }}>
                              <span>Total over {totals.remainingMonths} months</span>
                              <span>${(totals.totalMonthlyRecurring * totals.remainingMonths).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Final Totals */}
                    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {/* Pay Today Card */}
                      <div style={{
                        background: '#333',
                        padding: '25px',
                        textAlign: 'center',
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '8px'
                        }}>
                          Pay Today
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '500', color: '#fff', marginBottom: '5px' }}>
                          ${totals.payToday.toFixed(2)}
                        </div>
                        {totals.discountAmount > 0 && (
                          <div style={{ fontSize: '12px', color: '#8eff8e' }}>
                            You save ${totals.discountAmount.toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Then Monthly Card (only for monthly plan) */}
                      {!isFullPlan && totals.monthlyAfter > 0 && (
                        <div style={{
                          background: '#fff',
                          border: '2px solid #333',
                          padding: '20px',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: '11px',
                            color: '#777',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '8px'
                          }}>
                            Then Monthly × {totals.remainingMonths}
                          </div>
                          <div style={{ fontSize: '28px', fontWeight: '500', color: '#333' }}>
                            ${totals.monthlyAfter.toFixed(2)}
                            <span style={{ fontSize: '14px', fontWeight: '400', color: '#777' }}>/mo</span>
                          </div>
                        </div>
                      )}

                      {/* Total Cost Summary */}
                      <div style={{
                        background: '#fff',
                        border: '1px solid #d6d6d6',
                        padding: '15px'
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#777',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '10px'
                        }}>
                          Total Cost Summary
                        </div>
                        {isFullPlan ? (
                          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>One-time payment</span>
                              <strong style={{ color: '#333' }}>${totals.payToday.toFixed(2)}</strong>
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Today (incl. 1st month)</span>
                              <strong style={{ color: '#333' }}>${totals.payToday.toFixed(2)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{totals.remainingMonths} months × ${totals.monthlyAfter.toFixed(2)}</span>
                              <strong style={{ color: '#333' }}>${(totals.monthlyAfter * totals.remainingMonths).toFixed(2)}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '8px', borderTop: '1px solid #eee' }}>
                              <span style={{ fontWeight: '600', color: '#333' }}>Grand Total</span>
                              <strong style={{ color: '#333' }}>${(totals.payToday + (totals.monthlyAfter * totals.remainingMonths)).toFixed(2)}</strong>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info Box */}
                      <div style={{
                        background: '#fff',
                        border: '1px solid #d6d6d6',
                        padding: '15px',
                        fontSize: '12px',
                        color: '#666',
                        lineHeight: '1.8'
                      }}>
                        <div style={{ marginBottom: '4px' }}>
                          <strong style={{ color: '#333' }}>{enabledCount}</strong> modules included
                        </div>
                        <div style={{ marginBottom: '4px' }}>
                          <strong style={{ color: '#333' }}>{totals.totalIncludedUnits}</strong> included units
                        </div>
                        {totals.totalAdditionalUnits > 0 && (
                          <div>
                            <strong style={{ color: '#333' }}>{totals.totalAdditionalUnits}</strong> add'l units
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Section 4: Action Buttons */}
            <div style={{ background: '#fff', padding: '25px 30px', border: '1px solid #d6d6d6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ color: '#777', fontSize: '14px' }}>
                {isLinkExpiredOrUsed()
                  ? linkStatus === "expired"
                    ? "This quote has expired. Please contact us for a new quote."
                    : "This quote has already been used."
                  : "Review your pricing above and proceed to checkout when ready."}
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={downloadQuote}
                  style={{
                    padding: '15px 35px',
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    background: '#fff',
                    color: '#333',
                    border: '1px solid #333',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaDownload />
                  Download Quote
                </button>
                {!isLinkExpiredOrUsed() && (
                  <button
                    onClick={handlePayment}
                    disabled={processingPayment}
                    style={{
                      padding: '15px 40px',
                      fontSize: '14px',
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      background: '#333',
                      color: '#fff',
                      border: '1px solid #333',
                      cursor: processingPayment ? 'not-allowed' : 'pointer',
                      opacity: processingPayment ? 0.6 : 1,
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {processingPayment ? (
                      <>
                        <Spinner size="sm" animation="border" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default PricingReview;
