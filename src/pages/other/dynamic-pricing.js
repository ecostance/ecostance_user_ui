import { useEffect, useState, useRef, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Row, Col, Form, Button, Card, Alert, Badge, Table, Modal, Nav, Collapse, OverlayTrigger, Tooltip, Popover } from "react-bootstrap";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import Head from "next/head";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { Spinner } from "react-bootstrap";
import { FaSave, FaDollarSign, FaLink, FaCopy, FaShare, FaTrash, FaExternalLinkAlt, FaCalendarAlt, FaList, FaEdit, FaTimes, FaUser, FaEnvelope, FaCheckCircle, FaRedo, FaBuilding, FaUserTie, FaChevronDown, FaChevronUp, FaCog, FaUsers, FaCalendar, FaIdCard, FaTruck, FaBriefcase, FaInfoCircle, FaMinus, FaPlus, FaTh, FaCheck, FaClock, FaSync, FaCreditCard, FaInbox } from "react-icons/fa";
import {
  createPricingLink,
  getAllPricingLinks,
  deletePricingLink,
  updatePricingLink,
  getAdminPricingFunnel,
  getAdminModuleAccessInquiries,
  updateModuleAccessInquiryStatus,
} from "../../apiClient/pricingLinks";
import { isDynamicPricingAdmin } from "src/constants/dynamicPricingAdmins";

const FUNNEL_STAGE_LABELS = {
  link_sent: "Link Sent",
  link_viewed: "Link Clicked",
  checkout_started: "Checkout Started",
  payment_cancelled: "Payment Cancelled",
  payment_failed: "Payment Failed",
  payment_completed: "Paid",
};

// Module icons mapping
const MODULE_ICONS = {
  1: FaBriefcase,  // Business Account
  2: FaUsers,      // Employee Account
  3: FaCalendar,   // Event Page
  4: FaIdCard,     // Digital Passport Page
  5: FaTruck       // Supply Chain
};

// Fixed module data for all users
const FIXED_MODULES = [
  {
    id: 1,
    name: "Business Account",
    description: "Complete business management solution",
    defaultPricing: {
      modulePrice: 60.00,
      monthlyMaintenance: 6.00,
      includedUnits: 5,
      monthlyCostPerUser: 0.50
    }
  },
  {
    id: 2,
    name: "Employee Account",
    description: "Employee management and tracking",
    defaultPricing: {
      modulePrice: 60.00,
      monthlyMaintenance: 6.00,
      includedUnits: 5,
      monthlyCostPerUser: 0.50
    }
  },
  {
    id: 3,
    name: "Event Page",
    description: "Event management and hosting platform",
    defaultPricing: {
      modulePrice: 60.00,
      monthlyMaintenance: 6.00,
      includedUnits: 5,
      monthlyCostPerUser: 0.50
    }
  },
  {
    id: 4,
    name: "Digital Passport Page",
    description: "Digital identity and verification system",
    defaultPricing: {
      modulePrice: 60.00,
      monthlyMaintenance: 6.00,
      includedUnits: 5,
      monthlyCostPerUser: 0.50
    }
  },
  {
    id: 5,
    name: "Supply Chain",
    description: "Supply chain management and tracking",
    defaultPricing: {
      modulePrice: 60.00,
      monthlyMaintenance: 6.00,
      includedUnits: 5,
      monthlyCostPerUser: 0.50
    }
  }
];

const DynamicPricing = ({ userData }) => {
  const router = useRouter();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [modules] = useState(FIXED_MODULES);
  const [customPrices, setCustomPrices] = useState({});
  const [quantities, setQuantities] = useState({});
  const [enabledModules, setEnabledModules] = useState({});
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    role: "",
    companyName: ""
  });
  const [saving, setSaving] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [showLinkSection, setShowLinkSection] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [oneTimeFee, setOneTimeFee] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // "dollar" or "percentage"
  const [minUnits, setMinUnits] = useState(5);
  const [moduleViewType, setModuleViewType] = useState("list"); // "grid" or "list"
  const [paymentPlan, setPaymentPlan] = useState("full"); // "full" or "monthly"
  const [activeTab, setActiveTab] = useState("create");
  const [savedLinks, setSavedLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [linksPage, setLinksPage] = useState(1);
  const [linksTotalPages, setLinksTotalPages] = useState(1);
  const [linksFilter, setLinksFilter] = useState("");
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [purchasesPage, setPurchasesPage] = useState(1);
  const [purchasesFilter, setPurchasesFilter] = useState("all");
  const [purchasesEmail, setPurchasesEmail] = useState("");
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchasesRows, setPurchasesRows] = useState([]);
  const [purchasesSummary, setPurchasesSummary] = useState({});
  const [purchasesTotalPages, setPurchasesTotalPages] = useState(1);
  const [expandedPurchaseLinkId, setExpandedPurchaseLinkId] = useState(null);
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsFilter, setRequestsFilter] = useState("all");
  const [requestsEmail, setRequestsEmail] = useState("");
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsRows, setRequestsRows] = useState([]);
  const [requestsTotalPages, setRequestsTotalPages] = useState(1);

  useEffect(() => {
    const email =
      userData?.user?.email ||
      (typeof window !== "undefined" ? localStorage.getItem("email") : "");
    if (!userData?.isLoggedIn || !isDynamicPricingAdmin(email)) {
      router.replace("/");
    }
  }, [userData, router]);

  useEffect(() => {
    initializePricing();
  }, []);

  // Update all module includedUnits when minUnits changes (sync all modules to minUnits)
  useEffect(() => {
    if (minUnits > 0) {
      setCustomPrices(prev => {
        // If prev is empty, don't update yet (will be initialized by initializePricing)
        if (Object.keys(prev).length === 0) return prev;

        const updated = {};

        // Set all modules' includedUnits to the minUnits value
        modules.forEach(module => {
          const moduleId = module.id;
          const existing = prev[moduleId] || {};
          updated[moduleId] = {
            ...existing,
            includedUnits: minUnits
          };
        });

        return updated;
      });
    }
  }, [minUnits, modules]);

  useEffect(() => {
    if (activeTab === "manage") {
      loadSavedLinks();
    }
  }, [activeTab, linksPage, linksFilter]);

  useEffect(() => {
    if (activeTab === "purchases") {
      loadPurchases();
    }
  }, [activeTab, purchasesPage, purchasesFilter, purchasesEmail]);

  useEffect(() => {
    if (activeTab === "requests") {
      loadRequests();
    }
  }, [activeTab, requestsPage, requestsFilter, requestsEmail]);

  const loadRequests = async () => {
    setRequestsLoading(true);
    try {
      const response = await getAdminModuleAccessInquiries({
        page: requestsPage,
        limit: 10,
        status: requestsFilter !== "all" ? requestsFilter : undefined,
        email: requestsEmail || undefined,
      });
      if (response?.data?.success) {
        setRequestsRows(response.data.data || []);
        setRequestsTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      addToast("Failed to load contact requests", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleRequestStatusChange = async (id, status) => {
    try {
      await updateModuleAccessInquiryStatus(id, status);
      addToast("Request status updated", { appearance: "success", autoDismiss: true });
      loadRequests();
    } catch (error) {
      addToast("Failed to update status", { appearance: "error", autoDismiss: true });
    }
  };

  const loadPurchases = async () => {
    setPurchasesLoading(true);
    try {
      const response = await getAdminPricingFunnel({
        page: purchasesPage,
        limit: 10,
        filter: purchasesFilter,
        email: purchasesEmail || undefined,
      });
      if (response?.data?.success) {
        setPurchasesRows(response.data.data || []);
        setPurchasesSummary(response.data.summary || {});
        setPurchasesTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      addToast("Failed to load purchases funnel", { appearance: "error", autoDismiss: true });
    } finally {
      setPurchasesLoading(false);
    }
  };

  const loadSavedLinks = async () => {
    setLoadingLinks(true);
    try {
      const response = await getAllPricingLinks(linksPage, 10, linksFilter || null);
      if (response?.data?.success) {
        setSavedLinks(response.data.data?.links || response.data.data || []);
        setLinksTotalPages(response.data.data?.totalPages || 1);
      } else {
        console.error("Failed to load pricing links:", response?.data?.message);
        addToast(response?.data?.message || "Failed to load pricing links", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error loading pricing links:", error);
      addToast("Error loading pricing links. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoadingLinks(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!linkToDelete) return;

    setDeleting(true);
    try {
      const response = await deletePricingLink(linkToDelete.linkId);
      if (response?.data?.success) {
        addToast("Pricing link deleted successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setDeleteModalShow(false);
        setLinkToDelete(null);
        loadSavedLinks();
      } else {
        addToast(response?.data?.message || "Failed to delete pricing link", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Error deleting pricing link:", error);
      addToast("Error deleting pricing link. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleEditLink = (link) => {
    // Populate form with existing link data
    setUserInfo({
      name: link.userInfo?.name || "",
      email: link.userInfo?.email || "",
      role: link.userInfo?.role || "",
      companyName: link.userInfo?.companyName || ""
    });

    // Set custom prices from the link
    if (link.customPrices) {
      setCustomPrices(link.customPrices);
    }

    // Set enabled modules from the link
    if (link.enabledModules) {
      setEnabledModules(link.enabledModules);
    }

    // Set expiration date if exists
    if (link.expiresAt) {
      // Convert to datetime-local format
      const date = new Date(link.expiresAt);
      const localDateTime = date.toISOString().slice(0, 16);
      setExpiresAt(localDateTime);
    } else {
      setExpiresAt("");
    }

    // Set one-time fee if exists
    if (link.oneTimeFee !== undefined) {
      setOneTimeFee(link.oneTimeFee || "");
    } else {
      setOneTimeFee("");
    }

    // Set minimum units if exists
    if (link.minUnits !== undefined) {
      setMinUnits(link.minUnits);
    } else {
      setMinUnits(5);
    }

    // Set discount if exists
    if (link.discount !== undefined) {
      setDiscount(link.discount || "");
    } else {
      setDiscount("");
    }

    // Set discount type if exists
    if (link.discountType) {
      setDiscountType(link.discountType);
    } else {
      setDiscountType("percentage");
    }

    // Set payment plan if exists
    if (link.paymentPlan) {
      setPaymentPlan(link.paymentPlan);
    } else {
      setPaymentPlan("full");
    }

    // Set edit mode
    setIsEditMode(true);
    setEditingLinkId(link.linkId);
    setShowLinkSection(false);
    setGeneratedLink("");

    // Switch to create tab
    setActiveTab("create");

    addToast("Link loaded for editing", {
      appearance: "info",
      autoDismiss: true,
    });
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditingLinkId(null);
    setShowLinkSection(false);
    setGeneratedLink("");
    setMinUnits(5);
    initializePricing(5);
    setUserInfo({ name: "", email: "", role: "", companyName: "" });
    setExpiresAt("");
    setOneTimeFee("");
    setDiscount("");
    setDiscountType("percentage");
    setPaymentPlan("full");

    addToast("Edit cancelled", {
      appearance: "info",
      autoDismiss: true,
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "success",
      expired: "warning",
      used: "secondary"
    };
    return <Badge variant={variants[status] || "info"}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const initializePricing = (baseUnits) => {
    // Use provided baseUnits or fall back to current minUnits state or default 5
    const includedUnitsValue = baseUnits !== undefined ? baseUnits : (minUnits || 5);

    // Initialize custom prices, quantities, and enabled modules with default values
    const initialPrices = {};
    const initialQuantities = {};
    const initialEnabled = {};

    modules.forEach(module => {
      // Initialize custom pricing structure with default values
      initialPrices[module.id] = {
        modulePrice: module.defaultPricing.modulePrice,
        monthlyMaintenance: module.defaultPricing.monthlyMaintenance,
        includedUnits: includedUnitsValue,
        monthlyCostPerUser: module.defaultPricing.monthlyCostPerUser,
        units: 0  // Additional units start at 0
      };
      // Initialize quantity to 0
      initialQuantities[module.id] = 0;
      // Initialize all modules as enabled by default
      initialEnabled[module.id] = true;
    });

    setCustomPrices(initialPrices);
    setQuantities(initialQuantities);
    setEnabledModules(initialEnabled);
  };

  const handlePriceChange = (moduleId, priceType, newPrice) => {
    setCustomPrices(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [priceType]: parseFloat(newPrice) || 0
      }
    }));
  };

  const handleQuantityChange = (moduleId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [moduleId]: Math.max(0, parseInt(newQuantity) || 0)
    }));
  };

  const handleModuleToggle = (moduleId, isEnabled) => {
    setEnabledModules(prev => ({
      ...prev,
      [moduleId]: isEnabled
    }));
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateShareableLink = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.role || !userInfo.companyName) {
      addToast("Please fill in all required fields (name, email, role, and company name)", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    setSaving(true);
    try {
      const pricingData = {
        userInfo,
        customPrices,
        enabledModules,
        minUnits: minUnits || 5,
        oneTimeFee: parseFloat(oneTimeFee) || 0,
        discount: parseFloat(discount) || 0,
        discountType: discountType,
        paymentPlan: paymentPlan,
        modules: modules
          .filter(module => enabledModules[module.id]) // Only include enabled modules
          .map(module => ({
            id: module.id,
            name: module.name,
            description: module.description,
            defaultPricing: module.defaultPricing,
            customPricing: customPrices[module.id] || {}
          })),
        generatedAt: new Date().toISOString(),
        baseTotals: getModuleTotals()
      };

      // Add expiration date if set
      if (expiresAt) {
        pricingData.expiresAt = new Date(expiresAt).toISOString();
      }

      let response;
      let linkId;

      if (isEditMode && editingLinkId) {
        // Update existing pricing link
        response = await updatePricingLink(editingLinkId, pricingData);

        if (!response?.data?.success) {
          const errorMsg = response?.data?.message || "Failed to update pricing link";
          console.error("Error updating pricing link:", errorMsg);
          throw new Error(errorMsg);
        }

        linkId = editingLinkId;

        addToast("Pricing link updated successfully!", {
          appearance: "success",
          autoDismiss: true,
        });

        // Reset edit mode
        setIsEditMode(false);
        setEditingLinkId(null);
      } else {
        // Create new pricing link
        response = await createPricingLink(pricingData, expiresAt || null);

        if (!response?.data?.success) {
          const errorMsg = response?.data?.message || "Failed to save pricing link";
          console.error("Error saving pricing link:", errorMsg);
          throw new Error(errorMsg);
        }

        // Get linkId from backend response
        linkId = response.data.data?.linkId;
        if (!linkId) {
          throw new Error("No linkId returned from server");
        }

        addToast("Shareable pricing link generated successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
      }

      // Generate the shareable link
      const baseUrl = window.location.origin;
      const shareableLink = `${baseUrl}/other/pricing-review/${linkId}`;

      setGeneratedLink(shareableLink);
      setShowLinkSection(true);
    } catch (error) {
      console.error("Error generating/updating link:", error);
      addToast(error.message || "Error saving link. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      addToast("Link copied to clipboard!", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      console.error("Error copying link:", error);
      addToast("Error copying link. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const getTotalCustomPrice = () => {
    return modules.reduce((sum, module) => {
      const quantity = quantities[module.id] || 0;
      const pricing = customPrices[module.id] || {};
      
      if (quantity === 0) return sum;
      
      const moduleTotal = (pricing.modulePrice || 0) * quantity;
      const monthlyMaintenanceTotal = (pricing.monthlyMaintenance || 0) * quantity;
      const monthlyCostTotal = (pricing.monthlyCostPerUser || 0) * quantity;
      
      return sum + moduleTotal + monthlyMaintenanceTotal + monthlyCostTotal;
    }, 0);
  };

  const getOriginalTotalPrice = () => {
    return modules.reduce((sum, module) => {
      const quantity = quantities[module.id] || 0;
      const originalPrice = module.priceList?.[0]?.price || 0;
      const monthlyMaintenance = module.priceList?.[0]?.monthlyMaintenance || 0;
      const monthlyCostPerUser = module.priceList?.[0]?.monthlyCostPerUser || 0;
      
      if (quantity === 0) return sum;
      
      return sum + (originalPrice * quantity) + (monthlyMaintenance * quantity) + (monthlyCostPerUser * quantity);
    }, 0);
  };

  const getModuleTotals = () => {
    let totalModulePrice = 0;
    let totalMonthlyMaintenance = 0;
    let totalAdditionalUnitsCost = 0;
    let totalIncludedUnits = 0;
    let totalUnits = 0;
    let totalAdditionalUnits = 0;

    modules.forEach(module => {
      // Only include enabled modules in calculations
      if (enabledModules[module.id]) {
        const pricing = customPrices[module.id] || {};
        const includedUnits = pricing.includedUnits || minUnits || 5;
        const additionalUnits = pricing.units || 0;  // units field IS the additional units
        const additionalCost = additionalUnits * (pricing.monthlyCostPerUser || 0);

        totalModulePrice += (pricing.modulePrice || 0);
        totalMonthlyMaintenance += (pricing.monthlyMaintenance || 0);
        totalAdditionalUnitsCost += additionalCost;
        totalIncludedUnits += includedUnits;
        totalUnits += (includedUnits + additionalUnits);  // Total = included + additional
        totalAdditionalUnits += additionalUnits;
      }
    });

    const oneTimeFeeAmount = parseFloat(oneTimeFee) || 0;
    const discountValue = parseFloat(discount) || 0;
    const totalMonthlyRecurring = totalMonthlyMaintenance + totalAdditionalUnitsCost;

    // One-time costs (modules + one-time fee)
    const oneTimeCosts = totalModulePrice + oneTimeFeeAmount;

    // Full payment: everything upfront including 12 months of recurring
    const fullPaymentTotal = oneTimeCosts + (totalMonthlyRecurring * 12);

    // Monthly payment: one-time costs + 1st month today, then 11 months recurring
    const monthlyPaymentUpfront = oneTimeCosts + totalMonthlyRecurring;
    const remainingMonths = 11;

    // Calculate discount amount based on type and selected payment plan
    // For full payment: discount applies to the full amount
    // For monthly payment: discount applies to the upfront amount only
    let fullDiscountAmount = 0;
    let monthlyDiscountAmount = 0;

    if (discountType === "percentage") {
      fullDiscountAmount = (fullPaymentTotal * discountValue) / 100;
      monthlyDiscountAmount = (monthlyPaymentUpfront * discountValue) / 100;
    } else {
      fullDiscountAmount = Math.min(discountValue, fullPaymentTotal);
      monthlyDiscountAmount = Math.min(discountValue, monthlyPaymentUpfront);
    }

    // Final amounts after discount
    const fullPayToday = Math.max(0, fullPaymentTotal - fullDiscountAmount);
    const monthlyPayToday = Math.max(0, monthlyPaymentUpfront - monthlyDiscountAmount);

    return {
      totalModulePrice,
      totalMonthlyMaintenance,
      totalAdditionalUnitsCost,
      totalIncludedUnits,
      totalUnits,
      totalAdditionalUnits,
      oneTimeFee: oneTimeFeeAmount,
      discountValue,
      discountType,
      totalMonthlyRecurring,
      oneTimeCosts,
      // Full payment plan
      fullPaymentTotal,
      fullDiscountAmount,
      fullPayToday,
      fullMonthlyAfter: 0, // No monthly payments after full payment
      // Monthly payment plan
      monthlyPaymentUpfront,
      monthlyDiscountAmount,
      monthlyPayToday,
      monthlyPayAfter: totalMonthlyRecurring, // Monthly recurring for remaining months
      remainingMonths: remainingMonths, // 11 months (1st month included in upfront)
      // Legacy fields for backward compatibility
      grandTotal: fullPaymentTotal,
      discountAmount: fullDiscountAmount,
      payToday: fullPayToday,
      totalMonthlyCost: totalAdditionalUnitsCost // backward compatibility
    };
  };

  if (loading) {
    return (
      <LayoutTwo>
        <Head>
          <title>Dynamic Pricing - ECOSTANCE</title>
        </Head>
        <div className="dynamic-pricing-wrapper space-pt--50 space-pb--50">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
                <p className="mt-3">Loading modules...</p>
              </Col>
            </Row>
          </Container>
        </div>
      </LayoutTwo>
    );
  }

  return (
    <LayoutTwo>
      <Head>
        <title>Dynamic Pricing - ECOSTANCE</title>
      </Head>
      
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Dynamic Pricing"
        className="bg--3"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/" as={process.env.PUBLIC_URL + "/"}>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/other/individuals">
              <a>Individuals</a>
            </Link>
          </li>
          <li>Dynamic Pricing</li>
        </ul>
      </BreadcrumbOne>

      <div className="dynamic-pricing-wrapper space-pt--50 space-pb--50">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="dynamic-pricing-header text-center mb-5">
                <h2 className="mb-3">Dynamic Pricing Configuration</h2>
                <p className="text-muted">
                  Set your own custom pricing for each module. This allows you to create personalized pricing packages.
                </p>
              </div>
            </Col>
          </Row>

          <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="create" className="d-flex align-items-center">
                {isEditMode ? <><FaEdit style={{ marginRight: "8px" }} />Edit Pricing Link</> : <><FaLink style={{ marginRight: "8px" }} />Create Pricing Link</>}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="manage" className="d-flex align-items-center">
                <FaList style={{ marginRight: "8px" }} />Manage Links
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="purchases" className="d-flex align-items-center">
                <FaCreditCard style={{ marginRight: "8px" }} />Purchases
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="requests" className="d-flex align-items-center">
                <FaInbox style={{ marginRight: "8px" }} />Requests
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === "create" && (
            <>
              {/* Edit Mode Alert */}
              {isEditMode && (
                <Alert variant="warning" className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <FaEdit className="mr-2" />
                    <strong>Edit Mode:</strong> You are editing an existing pricing link ({editingLinkId})
                  </div>
                  <Button variant="outline-secondary" size="sm" onClick={cancelEdit}>
                    <FaTimes className="mr-1" /> Cancel Edit
                  </Button>
                </Alert>
              )}

              {/* New Layout - Full Width Sections */}
              <div style={{ display: 'grid', gap: '24px' }}>

                {/* Section 1: Client Information & Settings */}
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
                      Client Information & Settings
                    </h5>
                  </div>

                  {/* Client Details Row */}
                  <Row className="mb-4">
                    <Col md={3}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Label style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#333',
                          marginBottom: '10px',
                          display: 'block'
                        }}>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter full name"
                          value={userInfo.name}
                          onChange={(e) => handleUserInfoChange("name", e.target.value)}
                          style={{
                            border: 'none',
                            borderBottom: '2px solid #ccc',
                            borderRadius: 0,
                            padding: '10px 0',
                            fontSize: '14px',
                            background: 'transparent'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Label style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#333',
                          marginBottom: '10px',
                          display: 'block'
                        }}>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          value={userInfo.email}
                          onChange={(e) => handleUserInfoChange("email", e.target.value)}
                          style={{
                            border: 'none',
                            borderBottom: '2px solid #ccc',
                            borderRadius: 0,
                            padding: '10px 0',
                            fontSize: '14px',
                            background: 'transparent'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Label style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#333',
                          marginBottom: '10px',
                          display: 'block'
                        }}>Company Name *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter company"
                          value={userInfo.companyName}
                          onChange={(e) => handleUserInfoChange("companyName", e.target.value)}
                          style={{
                            border: 'none',
                            borderBottom: '2px solid #ccc',
                            borderRadius: 0,
                            padding: '10px 0',
                            fontSize: '14px',
                            background: 'transparent'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Label style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#333',
                          marginBottom: '10px',
                          display: 'block'
                        }}>Role *</Form.Label>
                        <Form.Control
                          as="select"
                          value={userInfo.role}
                          onChange={(e) => handleUserInfoChange("role", e.target.value)}
                          style={{
                            border: 'none',
                            borderBottom: '2px solid #ccc',
                            borderRadius: 0,
                            padding: '0px 0',
                            fontSize: '14px',
                            background: 'transparent',
                            color: '#333'
                          }}
                        >
                          <option value="">Select role...</option>
                          <option value="owner_partner">Owner/Partner</option>
                          <option value="employee_admin">Employee/Admin</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Settings Row */}
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Label style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#333',
                          marginBottom: '10px',
                          display: 'block'
                        }}>Minimum Units</Form.Label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0', width: '100%' }}>
                          <button
                            type="button"
                            onClick={() => setMinUnits(prev => Math.max(1, (prev || 5) - 1))}
                            disabled={(minUnits || 5) <= 1}
                            style={{
                              width: '45px',
                              height: '45px',
                              border: '2px solid #ccc',
                              borderRight: 'none',
                              background: (minUnits || 5) <= 1 ? '#f5f5f5' : '#fff',
                              cursor: (minUnits || 5) <= 1 ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#333',
                              flexShrink: 0
                            }}
                          >
                            <FaMinus style={{ fontSize: '10px' }} />
                          </button>
                          <Form.Control
                            type="number"
                            min="1"
                            value={minUnits}
                            onChange={(e) => setMinUnits(Math.max(1, parseInt(e.target.value) || 1))}
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              border: '2px solid #ccc',
                              borderRadius: 0,
                              height: '45px',
                              minWidth: '60px'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setMinUnits(prev => (prev || 5) + 1)}
                            style={{
                              width: '45px',
                              height: '45px',
                              border: '2px solid #ccc',
                              borderLeft: 'none',
                              background: '#fff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#333',
                              flexShrink: 0
                            }}
                          >
                            <FaPlus style={{ fontSize: '10px' }} />
                          </button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Label style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#333',
                          marginBottom: '10px',
                          display: 'block'
                        }}>Expiration (Optional)</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={expiresAt}
                          onChange={(e) => setExpiresAt(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          style={{
                            border: '2px solid #ccc',
                            borderRadius: 0,
                            height: '45px',
                            fontSize: '14px'
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-0">
                        <Form.Label style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#333',
                          marginBottom: '10px',
                          display: 'block'
                        }}>One-Time Fee (Optional)</Form.Label>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '2px solid #ccc'
                        }}>
                          <span style={{ padding: '0 12px', background: '#f8f8f8', color: '#333', height: '41px', display: 'flex', alignItems: 'center', borderRight: '2px solid #ccc' }}>$</span>
                          <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={oneTimeFee}
                            onChange={(e) => setOneTimeFee(e.target.value)}
                            style={{ border: 'none', borderRadius: 0, height: '41px' }}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-0">
                        <Form.Label style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          color: '#333',
                          marginBottom: '10px',
                          display: 'block'
                        }}>Discount (Optional)</Form.Label>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '2px solid #ccc'
                        }}>
                          <button
                            type="button"
                            onClick={() => setDiscountType(discountType === "dollar" ? "percentage" : "dollar")}
                            style={{
                              padding: '0 12px',
                              background: '#f8f8f8',
                              color: '#333',
                              height: '41px',
                              display: 'flex',
                              alignItems: 'center',
                              borderRight: '2px solid #ccc',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: '500',
                              fontSize: '14px',
                              minWidth: '40px',
                              justifyContent: 'center'
                            }}
                            title="Click to toggle between $ and %"
                          >
                            {discountType === "dollar" ? "$" : "%"}
                          </button>
                          <Form.Control
                            type="number"
                            min="0"
                            max={discountType === "percentage" ? 100 : undefined}
                            step={discountType === "percentage" ? 1 : 0.01}
                            placeholder={discountType === "percentage" ? "0" : "0.00"}
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            style={{ border: 'none', borderRadius: 0, height: '41px' }}
                          />
                        </div>
                        <small style={{ color: '#777', fontSize: '11px', marginTop: '5px', display: 'block' }}>
                          Click {discountType === "dollar" ? "$" : "%"} to switch type
                        </small>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Section 2: Configure Modules */}
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
                      Configure Modules
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
                    {modules.map((module) => {
                      const ModuleIcon = MODULE_ICONS[module.id] || FaCog;
                      const isEnabled = enabledModules[module.id];

                      return (
                        <div
                          key={module.id}
                          style={{
                            border: isEnabled ? '2px solid #333' : '1px solid #d6d6d6',
                            background: isEnabled ? '#fff' : '#f8f8f8',
                            padding: '24px',
                            transition: 'all 0.3s ease',
                            opacity: isEnabled ? 1 : 0.7
                          }}
                        >
                          {/* Card Header */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <div style={{
                                width: '48px',
                                height: '48px',
                                background: isEnabled ? '#333' : '#999',
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
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              userSelect: 'none'
                            }}>
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={(e) => handleModuleToggle(module.id, e.target.checked)}
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  cursor: 'pointer',
                                  accentColor: '#333'
                                }}
                              />
                            </label>
                          </div>

                          {/* Pricing Inputs */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                              <label style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                color: '#333',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'block',
                                marginBottom: '8px'
                              }}>
                                Module Price
                              </label>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #ccc',
                                background: isEnabled ? '#fff' : '#f5f5f5'
                              }}>
                                <span style={{ padding: '10px 12px', background: '#f8f8f8', color: '#333', fontSize: '14px', borderRight: '2px solid #ccc' }}>$</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={customPrices[module.id]?.modulePrice || ""}
                                  onChange={(e) => handlePriceChange(module.id, 'modulePrice', e.target.value)}
                                  disabled={!isEnabled}
                                  style={{
                                    border: 'none',
                                    outline: 'none',
                                    padding: '10px',
                                    width: '100%',
                                    fontSize: '14px',
                                    background: 'transparent'
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                color: '#333',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'block',
                                marginBottom: '8px'
                              }}>
                                Monthly Maint.
                              </label>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #ccc',
                                background: isEnabled ? '#fff' : '#f5f5f5'
                              }}>
                                <span style={{ padding: '10px 12px', background: '#f8f8f8', color: '#333', fontSize: '14px', borderRight: '2px solid #ccc' }}>$</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={customPrices[module.id]?.monthlyMaintenance || ""}
                                  onChange={(e) => handlePriceChange(module.id, 'monthlyMaintenance', e.target.value)}
                                  disabled={!isEnabled}
                                  style={{
                                    border: 'none',
                                    outline: 'none',
                                    padding: '10px',
                                    width: '100%',
                                    fontSize: '14px',
                                    background: 'transparent'
                                  }}
                                />
                              </div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <label style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                color: '#333',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'block',
                                marginBottom: '8px'
                              }}>
                                Included Units
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0', maxWidth: '150px' }}>
                                <button
                                  type="button"
                                  onClick={() => handlePriceChange(module.id, 'includedUnits', Math.max(1, (customPrices[module.id]?.includedUnits || 5) - 1))}
                                  disabled={!isEnabled || (customPrices[module.id]?.includedUnits || 5) <= 1}
                                  style={{
                                    width: '36px',
                                    height: '40px',
                                    border: '2px solid #ccc',
                                    borderRight: 'none',
                                    background: (!isEnabled || (customPrices[module.id]?.includedUnits || 5) <= 1) ? '#f5f5f5' : '#fff',
                                    cursor: (!isEnabled || (customPrices[module.id]?.includedUnits || 5) <= 1) ? 'not-allowed' : 'pointer',
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
                                  min="1"
                                  value={customPrices[module.id]?.includedUnits || 5}
                                  onChange={(e) => handlePriceChange(module.id, 'includedUnits', Math.max(1, parseInt(e.target.value) || 1))}
                                  disabled={!isEnabled}
                                  style={{
                                    width: '50px',
                                    height: '40px',
                                    border: '2px solid #ccc',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    background: isEnabled ? '#fff' : '#f5f5f5'
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handlePriceChange(module.id, 'includedUnits', (customPrices[module.id]?.includedUnits || 5) + 1)}
                                  disabled={!isEnabled}
                                  style={{
                                    width: '36px',
                                    height: '40px',
                                    border: '2px solid #ccc',
                                    borderLeft: 'none',
                                    background: !isEnabled ? '#f5f5f5' : '#fff',
                                    cursor: !isEnabled ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#333'
                                  }}
                                >
                                  <FaPlus style={{ fontSize: '10px' }} />
                                </button>
                              </div>
                            </div>

                            {/* Separator */}
                            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #ddd', margin: '5px 0' }} />

                            <div>
                              <label style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                color: '#333',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'block',
                                marginBottom: '8px'
                              }}>
                                Cost/Add'l User
                              </label>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '2px solid #ccc',
                                background: isEnabled ? '#fff' : '#f5f5f5'
                              }}>
                                <span style={{ padding: '10px 12px', background: '#f8f8f8', color: '#333', fontSize: '14px', borderRight: '2px solid #ccc' }}>$</span>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={customPrices[module.id]?.monthlyCostPerUser || ""}
                                  onChange={(e) => handlePriceChange(module.id, 'monthlyCostPerUser', e.target.value)}
                                  disabled={!isEnabled}
                                  style={{
                                    border: 'none',
                                    outline: 'none',
                                    padding: '10px',
                                    width: '100%',
                                    fontSize: '14px',
                                    background: 'transparent'
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                color: '#333',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'block',
                                marginBottom: '8px'
                              }}>
                                Add'l Units
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                <button
                                  type="button"
                                  onClick={() => handlePriceChange(module.id, 'units', Math.max(0, (customPrices[module.id]?.units || 0) - 1))}
                                  disabled={!isEnabled || (customPrices[module.id]?.units || 0) <= 0}
                                  style={{
                                    width: '36px',
                                    height: '40px',
                                    border: '2px solid #ccc',
                                    borderRight: 'none',
                                    background: (!isEnabled || (customPrices[module.id]?.units || 0) <= 0) ? '#f5f5f5' : '#fff',
                                    cursor: (!isEnabled || (customPrices[module.id]?.units || 0) <= 0) ? 'not-allowed' : 'pointer',
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
                                  min={0}
                                  value={customPrices[module.id]?.units || 0}
                                  onChange={(e) => handlePriceChange(module.id, 'units', Math.max(0, parseInt(e.target.value) || 0))}
                                  disabled={!isEnabled}
                                  style={{
                                    width: '50px',
                                    height: '40px',
                                    border: '2px solid #ccc',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    background: isEnabled ? '#fff' : '#f5f5f5'
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handlePriceChange(module.id, 'units', (customPrices[module.id]?.units || 0) + 1)}
                                  disabled={!isEnabled}
                                  style={{
                                    width: '36px',
                                    height: '40px',
                                    border: '2px solid #ccc',
                                    borderLeft: 'none',
                                    background: !isEnabled ? '#f5f5f5' : '#fff',
                                    cursor: !isEnabled ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#333'
                                  }}
                                >
                                  <FaPlus style={{ fontSize: '10px' }} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}

                  {/* Module Cards - List View */}
                  {moduleViewType === "list" && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {modules.map((module) => {
                      const ModuleIcon = MODULE_ICONS[module.id] || FaCog;
                      const isEnabled = enabledModules[module.id];

                      return (
                        <div
                          key={module.id}
                          style={{
                            border: isEnabled ? '2px solid #333' : '1px solid #d6d6d6',
                            background: isEnabled ? '#fff' : '#f8f8f8',
                            padding: '20px',
                            transition: 'all 0.3s ease',
                            opacity: isEnabled ? 1 : 0.7
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                            {/* Module Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '0 0 350px' }}>
                              <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                userSelect: 'none'
                              }}>
                                <input
                                  type="checkbox"
                                  checked={isEnabled}
                                  onChange={(e) => handleModuleToggle(module.id, e.target.checked)}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    accentColor: '#333'
                                  }}
                                />
                              </label>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                background: isEnabled ? '#333' : '#999',
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

                            {/* Pricing Inputs - Horizontal - Right Aligned */}
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                              <div style={{ width: '120px' }}>
                                <label style={{
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  color: '#777',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  display: 'block',
                                  marginBottom: '5px'
                                }}>
                                  Module Price
                                </label>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  border: '1px solid #ccc',
                                  background: isEnabled ? '#fff' : '#f5f5f5'
                                }}>
                                  <span style={{ padding: '8px 10px', background: '#f8f8f8', color: '#333', fontSize: '13px', borderRight: '1px solid #ccc' }}>$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={customPrices[module.id]?.modulePrice || ""}
                                    onChange={(e) => handlePriceChange(module.id, 'modulePrice', e.target.value)}
                                    disabled={!isEnabled}
                                    style={{
                                      border: 'none',
                                      outline: 'none',
                                      padding: '8px',
                                      width: '100%',
                                      fontSize: '13px',
                                      background: 'transparent'
                                    }}
                                  />
                                </div>
                              </div>

                              <div style={{ width: '120px' }}>
                                <label style={{
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  color: '#777',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  display: 'block',
                                  marginBottom: '5px'
                                }}>
                                  Monthly Maint.
                                </label>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  border: '1px solid #ccc',
                                  background: isEnabled ? '#fff' : '#f5f5f5'
                                }}>
                                  <span style={{ padding: '8px 10px', background: '#f8f8f8', color: '#333', fontSize: '13px', borderRight: '1px solid #ccc' }}>$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={customPrices[module.id]?.monthlyMaintenance || ""}
                                    onChange={(e) => handlePriceChange(module.id, 'monthlyMaintenance', e.target.value)}
                                    disabled={!isEnabled}
                                    style={{
                                      border: 'none',
                                      outline: 'none',
                                      padding: '8px',
                                      width: '100%',
                                      fontSize: '13px',
                                      background: 'transparent'
                                    }}
                                  />
                                </div>
                              </div>

                              <div style={{ width: '100px' }}>
                                <label style={{
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  color: '#777',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  display: 'block',
                                  marginBottom: '5px'
                                }}>
                                  Included Units
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                  <button
                                    type="button"
                                    onClick={() => handlePriceChange(module.id, 'includedUnits', Math.max(1, (customPrices[module.id]?.includedUnits || 5) - 1))}
                                    disabled={!isEnabled || (customPrices[module.id]?.includedUnits || 5) <= 1}
                                    style={{
                                      width: '28px',
                                      height: '34px',
                                      border: '1px solid #ccc',
                                      borderRight: 'none',
                                      background: (!isEnabled || (customPrices[module.id]?.includedUnits || 5) <= 1) ? '#f5f5f5' : '#fff',
                                      cursor: (!isEnabled || (customPrices[module.id]?.includedUnits || 5) <= 1) ? 'not-allowed' : 'pointer',
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
                                    min="1"
                                    value={customPrices[module.id]?.includedUnits || 5}
                                    onChange={(e) => handlePriceChange(module.id, 'includedUnits', Math.max(1, parseInt(e.target.value) || 1))}
                                    disabled={!isEnabled}
                                    style={{
                                      width: '40px',
                                      height: '34px',
                                      border: '1px solid #ccc',
                                      textAlign: 'center',
                                      fontSize: '13px',
                                      background: isEnabled ? '#fff' : '#f5f5f5'
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handlePriceChange(module.id, 'includedUnits', (customPrices[module.id]?.includedUnits || 5) + 1)}
                                    disabled={!isEnabled}
                                    style={{
                                      width: '28px',
                                      height: '34px',
                                      border: '1px solid #ccc',
                                      borderLeft: 'none',
                                      background: !isEnabled ? '#f5f5f5' : '#fff',
                                      cursor: !isEnabled ? 'not-allowed' : 'pointer',
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

                              {/* Separator */}
                              <div style={{
                                width: '1px',
                                background: '#ccc',
                                alignSelf: 'stretch',
                                marginTop: '-20px',
                                marginBottom: '-20px'
                              }} />

                              <div style={{ width: '120px' }}>
                                <label style={{
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  color: '#777',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  display: 'block',
                                  marginBottom: '5px'
                                }}>
                                  Cost/Add'l User
                                </label>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  border: '1px solid #ccc',
                                  background: isEnabled ? '#fff' : '#f5f5f5'
                                }}>
                                  <span style={{ padding: '8px 10px', background: '#f8f8f8', color: '#333', fontSize: '13px', borderRight: '1px solid #ccc' }}>$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={customPrices[module.id]?.monthlyCostPerUser || ""}
                                    onChange={(e) => handlePriceChange(module.id, 'monthlyCostPerUser', e.target.value)}
                                    disabled={!isEnabled}
                                    style={{
                                      border: 'none',
                                      outline: 'none',
                                      padding: '8px',
                                      width: '100%',
                                      fontSize: '13px',
                                      background: 'transparent'
                                    }}
                                  />
                                </div>
                              </div>

                              <div style={{ width: '100px' }}>
                                <label style={{
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  color: '#777',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  display: 'block',
                                  marginBottom: '5px'
                                }}>
                                  Add'l Units
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                  <button
                                    type="button"
                                    onClick={() => handlePriceChange(module.id, 'units', Math.max(0, (customPrices[module.id]?.units || 0) - 1))}
                                    disabled={!isEnabled || (customPrices[module.id]?.units || 0) <= 0}
                                    style={{
                                      width: '28px',
                                      height: '34px',
                                      border: '1px solid #ccc',
                                      borderRight: 'none',
                                      background: (!isEnabled || (customPrices[module.id]?.units || 0) <= 0) ? '#f5f5f5' : '#fff',
                                      cursor: (!isEnabled || (customPrices[module.id]?.units || 0) <= 0) ? 'not-allowed' : 'pointer',
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
                                    min={0}
                                    value={customPrices[module.id]?.units || 0}
                                    onChange={(e) => handlePriceChange(module.id, 'units', Math.max(0, parseInt(e.target.value) || 0))}
                                    disabled={!isEnabled}
                                    style={{
                                      width: '40px',
                                      height: '34px',
                                      border: '1px solid #ccc',
                                      textAlign: 'center',
                                      fontSize: '13px',
                                      background: isEnabled ? '#fff' : '#f5f5f5'
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handlePriceChange(module.id, 'units', (customPrices[module.id]?.units || 0) + 1)}
                                    disabled={!isEnabled}
                                    style={{
                                      width: '28px',
                                      height: '34px',
                                      border: '1px solid #ccc',
                                      borderLeft: 'none',
                                      background: !isEnabled ? '#f5f5f5' : '#fff',
                                      cursor: !isEnabled ? 'not-allowed' : 'pointer',
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
                        onClick={() => setPaymentPlan("full")}
                        style={{
                          padding: '10px 20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          border: 'none',
                          background: paymentPlan === "full" ? '#333' : '#fff',
                          color: paymentPlan === "full" ? '#fff' : '#666',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Pay Full Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentPlan("monthly")}
                        style={{
                          padding: '10px 20px',
                          fontSize: '12px',
                          fontWeight: '500',
                          border: 'none',
                          borderLeft: '1px solid #ccc',
                          background: paymentPlan === "monthly" ? '#333' : '#fff',
                          color: paymentPlan === "monthly" ? '#fff' : '#666',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        12-Month Plan
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const totals = getModuleTotals();
                    const enabledCount = Object.values(enabledModules).filter(Boolean).length;
                    const isFullPlan = paymentPlan === "full";

                    // Select values based on payment plan
                    const payToday = isFullPlan ? totals.fullPayToday : totals.monthlyPayToday;
                    const discountAmount = isFullPlan ? totals.fullDiscountAmount : totals.monthlyDiscountAmount;
                    const monthlyAfter = isFullPlan ? 0 : totals.monthlyPayAfter;
                    const totalBeforeDiscount = isFullPlan ? totals.fullPaymentTotal : totals.monthlyPaymentUpfront;

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
                                : 'Pay module setup and one-time fee today, then monthly recurring for 12 months. Discount applies to today\'s payment.'}
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
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: '#666', fontSize: '14px' }}>One-Time Fee</span>
                                <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>${totals.oneTimeFee.toFixed(2)}</span>
                              </div>
                              {!isFullPlan && (
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
                                      <span style={{ color: '#666', fontSize: '13px' }}>${totals.totalAdditionalUnitsCost.toFixed(2)}</span>
                                    </div>
                                  )}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px dotted #ddd' }}>
                                    <span style={{ color: '#333', fontSize: '13px', fontWeight: '500', paddingLeft: '10px' }}>1st Month Total</span>
                                    <span style={{ color: '#333', fontSize: '13px', fontWeight: '500' }}>${totals.totalMonthlyRecurring.toFixed(2)}</span>
                                  </div>
                                </div>
                              )}
                              {isFullPlan && (
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
                                            <Popover id="base-maint-breakdown-full" style={{ maxWidth: '320px' }}>
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
                                                {modules.filter(m => enabledModules[m.id]).map(module => {
                                                  const pricing = customPrices[module.id] || {};
                                                  const maintenance = pricing.monthlyMaintenance || 0;
                                                  const includedUnits = pricing.includedUnits || 5;
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
                                                        {includedUnits} units @ <strong style={{ color: '#333' }}>${maintenance.toFixed(2)}</strong>
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
                                                  <span>${totals.totalMonthlyMaintenance.toFixed(2)}/mo</span>
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
                                              <Popover id="addl-units-breakdown-full" style={{ maxWidth: '320px' }}>
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
                                                  {modules.filter(m => enabledModules[m.id]).map(module => {
                                                    const pricing = customPrices[module.id] || {};
                                                    const addlUnits = pricing.units || 0;
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
                                                    <span>${totals.totalAdditionalUnitsCost.toFixed(2)}/mo</span>
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
                                        <span style={{ color: '#666', fontSize: '13px' }}>${totals.totalAdditionalUnitsCost.toFixed(2)}/mo</span>
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
                                <span style={{ color: '#333', fontSize: '14px', fontWeight: '600' }}>${totalBeforeDiscount.toFixed(2)}</span>
                              </div>
                              {discountAmount > 0 && (
                                <>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <span style={{ color: '#28a745', fontSize: '14px' }}>
                                      Discount {totals.discountType === "percentage" ? `(${totals.discountValue}%)` : ''}
                                    </span>
                                    <span style={{ color: '#28a745', fontSize: '14px', fontWeight: '500' }}>-${discountAmount.toFixed(2)}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
                                    <span style={{ color: '#333', fontSize: '15px', fontWeight: '600' }}>Total</span>
                                    <span style={{ color: '#333', fontSize: '15px', fontWeight: '600' }}>${payToday.toFixed(2)}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Monthly Recurring (only for monthly plan) */}
                          {!isFullPlan && (
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
                                        <Popover id="base-maint-breakdown-monthly" style={{ maxWidth: '320px' }}>
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
                                            {modules.filter(m => enabledModules[m.id]).map(module => {
                                              const pricing = customPrices[module.id] || {};
                                              const maintenance = pricing.monthlyMaintenance || 0;
                                              const includedUnits = pricing.includedUnits || 5;
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
                                                    {includedUnits} units @ <strong style={{ color: '#333' }}>${maintenance.toFixed(2)}</strong>
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
                                              <span>${totals.totalMonthlyMaintenance.toFixed(2)}/mo</span>
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
                                          <Popover id="addl-units-breakdown-monthly" style={{ maxWidth: '320px' }}>
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
                                              {modules.filter(m => enabledModules[m.id]).map(module => {
                                                const pricing = customPrices[module.id] || {};
                                                const addlUnits = pricing.units || 0;
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
                                                <span>${totals.totalAdditionalUnitsCost.toFixed(2)}/mo</span>
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
                                    <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>${totals.totalAdditionalUnitsCost.toFixed(2)}/mo</span>
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
                              ${payToday.toFixed(2)}
                            </div>
                            {discountAmount > 0 && (
                              <div style={{ fontSize: '12px', color: '#8eff8e' }}>
                                You save ${discountAmount.toFixed(2)}
                              </div>
                            )}
                          </div>

                          {/* Then Monthly Card (only for monthly plan) */}
                          {!isFullPlan && (
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
                                ${monthlyAfter.toFixed(2)}
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
                                  <strong style={{ color: '#333' }}>${payToday.toFixed(2)}</strong>
                                </div>
                              </div>
                            ) : (
                              <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.8' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Today (incl. 1st month)</span>
                                  <strong style={{ color: '#333' }}>${payToday.toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{totals.remainingMonths} months × ${monthlyAfter.toFixed(2)}</span>
                                  <strong style={{ color: '#333' }}>${(monthlyAfter * totals.remainingMonths).toFixed(2)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', marginTop: '8px', borderTop: '1px solid #eee' }}>
                                  <span style={{ fontWeight: '600', color: '#333' }}>Grand Total</span>
                                  <strong style={{ color: '#333' }}>${(payToday + (monthlyAfter * totals.remainingMonths)).toFixed(2)}</strong>
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
                              <strong style={{ color: '#333' }}>{enabledCount}</strong> of {modules.length} modules enabled
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

                {/* Generate Button Section / Success Section */}
                {showLinkSection && generatedLink ? (
                  <div style={{ background: '#fff', border: '1px solid #d6d6d6' }}>
                    {/* Compact Success Header */}
                    <div style={{
                      background: '#333',
                      padding: '15px 25px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <FaCheckCircle style={{ fontSize: '24px', color: 'white' }} />
                      <div>
                        <div style={{ color: 'white', fontWeight: '500', fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                          {isEditMode ? "Link Updated Successfully" : "Pricing Link Created"}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '2px' }}>
                          for {userInfo.name} • {userInfo.companyName}
                        </div>
                      </div>
                    </div>

                    {/* Link and Actions */}
                    <div style={{ padding: '20px 25px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{
                          display: 'flex',
                          border: '1px solid #ccc',
                          background: '#f8f8f8'
                        }}>
                          <div style={{
                            flex: 1,
                            padding: '12px 15px',
                            fontSize: '13px',
                            color: '#333',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'monospace'
                          }}>
                            {generatedLink}
                          </div>
                          <button
                            onClick={copyLinkToClipboard}
                            style={{
                              borderLeft: '1px solid #ccc',
                              padding: '12px 20px',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#fff',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '12px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            <FaCopy />
                            Copy
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => window.open(generatedLink, '_blank')}
                          style={{
                            padding: '12px 25px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#333',
                            color: '#fff',
                            border: '1px solid #333',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          <FaExternalLinkAlt />
                          Preview
                        </button>
                        <button
                          onClick={() => {
                            setShowLinkSection(false);
                            setGeneratedLink("");
                            initializePricing();
                            setUserInfo({ name: "", email: "", role: "", companyName: "" });
                            setExpiresAt("");
                            setOneTimeFee(0);
                            setDiscount("");
                            setDiscountType("percentage");
                            setPaymentPlan("full");
                          }}
                          style={{
                            padding: '12px 25px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#fff',
                            color: '#333',
                            border: '1px solid #333',
                            cursor: 'pointer',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          <FaRedo />
                          New Link
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#fff', padding: '25px 30px', border: '1px solid #d6d6d6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ color: '#777', fontSize: '14px' }}>
                      Fill in client details and configure modules above, then generate your shareable pricing link.
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      {isEditMode && (
                        <button
                          onClick={cancelEdit}
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
                            transition: 'all 0.3s'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={generateShareableLink}
                        disabled={saving || !userInfo.name || !userInfo.email || !userInfo.role || !userInfo.companyName}
                        style={{
                          padding: '15px 40px',
                          fontSize: '14px',
                          fontWeight: '500',
                          letterSpacing: '1px',
                          textTransform: 'uppercase',
                          background: '#333',
                          color: '#fff',
                          border: '1px solid #333',
                          cursor: (saving || !userInfo.name || !userInfo.email || !userInfo.role || !userInfo.companyName) ? 'not-allowed' : 'pointer',
                          opacity: (saving || !userInfo.name || !userInfo.email || !userInfo.role || !userInfo.companyName) ? 0.6 : 1,
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {saving ? (
                          <>
                            <Spinner size="sm" />
                            {isEditMode ? "Updating..." : "Generating..."}
                          </>
                        ) : isEditMode ? (
                          <>
                            <FaSave />
                            Update Pricing Link
                          </>
                        ) : (
                          <>
                            <FaLink />
                            Generate Pricing Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "manage" && (
            <>
              {/* Summary Stats */}
              <Row className="mb-4">
                <Col md={3} sm={6} className="mb-3">
                  <Card style={{ borderLeft: "4px solid #007bff", height: "100%" }}>
                    <Card.Body className="py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted mb-1" style={{ fontSize: "12px", textTransform: "uppercase" }}>Total Links</h6>
                          <h3 className="mb-0" style={{ color: "#007bff" }}>{savedLinks.length}</h3>
                        </div>
                        <div style={{ fontSize: "28px", opacity: 0.3 }}>
                          <FaLink />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6} className="mb-3">
                  <Card style={{ borderLeft: "4px solid #28a745", height: "100%" }}>
                    <Card.Body className="py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted mb-1" style={{ fontSize: "12px", textTransform: "uppercase" }}>Active</h6>
                          <h3 className="mb-0" style={{ color: "#28a745" }}>{savedLinks.filter(l => l.status === "active").length}</h3>
                        </div>
                        <div style={{ fontSize: "28px", opacity: 0.3, color: "#28a745" }}>
                          <FaCheck />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6} className="mb-3">
                  <Card style={{ borderLeft: "4px solid #ffc107", height: "100%" }}>
                    <Card.Body className="py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted mb-1" style={{ fontSize: "12px", textTransform: "uppercase" }}>Expired</h6>
                          <h3 className="mb-0" style={{ color: "#ffc107" }}>{savedLinks.filter(l => l.status === "expired").length}</h3>
                        </div>
                        <div style={{ fontSize: "28px", opacity: 0.3, color: "#ffc107" }}>
                          <FaClock />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6} className="mb-3">
                  <Card style={{ borderLeft: "4px solid #6c757d", height: "100%" }}>
                    <Card.Body className="py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="text-muted mb-1" style={{ fontSize: "12px", textTransform: "uppercase" }}>Used</h6>
                          <h3 className="mb-0" style={{ color: "#6c757d" }}>{savedLinks.filter(l => l.status === "used").length}</h3>
                        </div>
                        <div style={{ fontSize: "28px", opacity: 0.3, color: "#6c757d" }}>
                          <FaCheckCircle />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Main Card */}
              <Card style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <Card.Header style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
                  <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ gap: "12px" }}>
                    <h5 className="mb-0" style={{ fontWeight: "600" }}>
                      Saved Pricing Links
                    </h5>
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: "12px" }}>
                      <Form.Control
                        as="select"
                        size="sm"
                        value={linksFilter}
                        onChange={(e) => {
                          setLinksFilter(e.target.value);
                          setLinksPage(1);
                        }}
                        style={{
                          width: "140px",
                          borderRadius: "6px",
                          border: "1px solid #ced4da"
                        }}
                      >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="used">Used</option>
                      </Form.Control>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={loadSavedLinks}
                        disabled={loadingLinks}
                        style={{ borderRadius: "6px", padding: "6px 16px" }}
                      >
                        {loadingLinks ? <Spinner size="sm" /> : (
                          <>
                            <FaSync style={{ marginRight: "6px" }} />
                            Refresh
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body style={{ padding: "0" }}>
                  {loadingLinks ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" role="status" variant="primary">
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                      <p className="mt-3 text-muted">Loading pricing links...</p>
                    </div>
                  ) : savedLinks.length === 0 ? (
                    <div className="text-center py-5">
                      <div style={{ fontSize: "48px", color: "#dee2e6", marginBottom: "16px" }}>
                        <FaLink />
                      </div>
                      <h5 className="text-muted">No Pricing Links Found</h5>
                      <p className="text-muted mb-4">Create your first pricing link to get started</p>
                      <Button
                        variant="primary"
                        onClick={() => setActiveTab("create")}
                        style={{ borderRadius: "6px" }}
                      >
                        Create Pricing Link
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <Table hover style={{ marginBottom: "0" }}>
                          <thead style={{ backgroundColor: "#f8f9fa" }}>
                            <tr>
                              <th style={{ padding: "16px", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", color: "#495057", borderBottom: "2px solid #dee2e6" }}>Client Info</th>
                              <th style={{ padding: "16px", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", color: "#495057", borderBottom: "2px solid #dee2e6" }}>Pricing</th>
                              <th style={{ padding: "16px", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", color: "#495057", borderBottom: "2px solid #dee2e6" }}>Status</th>
                              <th style={{ padding: "16px", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", color: "#495057", borderBottom: "2px solid #dee2e6" }}>Dates</th>
                              <th style={{ padding: "16px", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", color: "#495057", borderBottom: "2px solid #dee2e6", textAlign: "center" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {savedLinks.map((link, index) => (
                              <tr
                                key={link._id || link.linkId}
                                style={{
                                  backgroundColor: index % 2 === 0 ? "#fff" : "#fafbfc",
                                  transition: "background-color 0.2s"
                                }}
                              >
                                <td style={{ padding: "16px", verticalAlign: "middle" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                      backgroundColor: "#e9ecef",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "600",
                                      color: "#495057",
                                      fontSize: "14px"
                                    }}>
                                      {(link.userInfo?.name || "N").charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: "600", color: "#212529", marginBottom: "2px" }}>
                                        {link.userInfo?.name || "N/A"}
                                      </div>
                                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                        {link.userInfo?.email || "N/A"}
                                      </div>
                                      <div style={{ fontSize: "11px", color: "#adb5bd", marginTop: "2px" }}>
                                        {link.userInfo?.companyName || ""}
                                        {link.userInfo?.companyName && link.userInfo?.role && " • "}
                                        {link.userInfo?.role === "owner_partner" ? "Owner/Partner" : link.userInfo?.role === "employee_admin" ? "Employee/Admin" : ""}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "16px", verticalAlign: "middle" }}>
                                  <div>
                                    {link.oneTimeFee > 0 && (
                                      <div style={{ marginBottom: "4px" }}>
                                        <span style={{ fontSize: "12px", color: "#6c757d" }}>Setup Fee: </span>
                                        <span style={{ fontWeight: "600", color: "#212529" }}>
                                          ${parseFloat(link.oneTimeFee).toFixed(2)}
                                        </span>
                                      </div>
                                    )}
                                    {link.discount > 0 && (
                                      <div>
                                        <Badge
                                          variant="success"
                                          style={{
                                            fontSize: "11px",
                                            padding: "4px 8px",
                                            backgroundColor: "#d4edda",
                                            color: "#155724",
                                            fontWeight: "500"
                                          }}
                                        >
                                          {link.discountType === "percentage"
                                            ? `${parseFloat(link.discount).toFixed(0)}% OFF`
                                            : `$${parseFloat(link.discount).toFixed(2)} OFF`}
                                        </Badge>
                                      </div>
                                    )}
                                    {!link.oneTimeFee && !link.discount && (
                                      <span style={{ color: "#adb5bd", fontSize: "13px" }}>Standard pricing</span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: "16px", verticalAlign: "middle" }}>
                                  <Badge
                                    style={{
                                      padding: "6px 12px",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      borderRadius: "20px",
                                      backgroundColor: link.status === "active" ? "#d4edda" : link.status === "expired" ? "#fff3cd" : "#e2e3e5",
                                      color: link.status === "active" ? "#155724" : link.status === "expired" ? "#856404" : "#383d41"
                                    }}
                                  >
                                    {link.status === "active" ? "Active" : link.status === "expired" ? "Expired" : "Used"}
                                  </Badge>
                                </td>
                                <td style={{ padding: "16px", verticalAlign: "middle" }}>
                                  <div style={{ fontSize: "13px" }}>
                                    <div style={{ marginBottom: "4px" }}>
                                      <span style={{ color: "#6c757d" }}>Created: </span>
                                      <span style={{ color: "#212529" }}>{formatDate(link.createdAt)}</span>
                                    </div>
                                    <div>
                                      <span style={{ color: "#6c757d" }}>Expires: </span>
                                      <span style={{ color: link.expiresAt ? "#212529" : "#adb5bd" }}>
                                        {link.expiresAt ? formatDate(link.expiresAt) : "Never"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "16px", verticalAlign: "middle", textAlign: "center" }}>
                                  <div className="d-flex justify-content-center" style={{ gap: "6px" }}>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      onClick={() => handleEditLink(link)}
                                      title="Edit Link"
                                      style={{
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6",
                                        padding: "6px 10px"
                                      }}
                                    >
                                      <FaEdit style={{ color: "#28a745" }} />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      onClick={() => {
                                        const url = `${window.location.origin}/other/pricing-review/${link.linkId}`;
                                        navigator.clipboard.writeText(url);
                                        addToast("Link copied to clipboard!", {
                                          appearance: "success",
                                          autoDismiss: true,
                                        });
                                      }}
                                      title="Copy Link"
                                      style={{
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6",
                                        padding: "6px 10px"
                                      }}
                                    >
                                      <FaCopy style={{ color: "#007bff" }} />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      onClick={() => window.open(`/other/pricing-review/${link.linkId}`, "_blank")}
                                      title="Preview Link"
                                      style={{
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6",
                                        padding: "6px 10px"
                                      }}
                                    >
                                      <FaExternalLinkAlt style={{ color: "#6c757d" }} />
                                    </Button>
                                    <Button
                                      variant="light"
                                      size="sm"
                                      onClick={() => {
                                        setLinkToDelete(link);
                                        setDeleteModalShow(true);
                                      }}
                                      title="Delete Link"
                                      style={{
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6",
                                        padding: "6px 10px"
                                      }}
                                    >
                                      <FaTrash style={{ color: "#dc3545" }} />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {linksTotalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ borderTop: "1px solid #dee2e6", backgroundColor: "#f8f9fa" }}>
                          <span style={{ fontSize: "13px", color: "#6c757d" }}>
                            Showing page {linksPage} of {linksTotalPages}
                          </span>
                          <div className="d-flex" style={{ gap: "8px" }}>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => setLinksPage((p) => Math.max(1, p - 1))}
                              disabled={linksPage <= 1}
                              style={{ borderRadius: "6px", padding: "6px 16px" }}
                            >
                              Previous
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => setLinksPage((p) => Math.min(linksTotalPages, p + 1))}
                              disabled={linksPage >= linksTotalPages}
                              style={{ borderRadius: "6px", padding: "6px 16px" }}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {activeTab === "purchases" && (
            <>
              <Row className="mb-4">
                {[
                  { key: "link_sent", label: "Sent", color: "#007bff" },
                  { key: "link_viewed", label: "Clicked", color: "#17a2b8" },
                  { key: "checkout_started", label: "Checkout", color: "#ffc107" },
                  { key: "payment_completed", label: "Paid", color: "#28a745" },
                  { key: "abandoned", label: "Abandoned", color: "#dc3545" },
                ].map((card) => (
                  <Col md={2} sm={6} className="mb-3" key={card.key}>
                    <Card style={{ borderLeft: `4px solid ${card.color}`, height: "100%" }}>
                      <Card.Body className="py-3">
                        <h6 className="text-muted mb-1">{card.label}</h6>
                        <h4 className="mb-0">{purchasesSummary[card.key] || 0}</h4>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Card className="mb-4">
                <Card.Body>
                  <Row className="align-items-end">
                    <Col md={3}>
                      <Form.Label>Filter</Form.Label>
                      <Form.Control
                        as="select"
                        value={purchasesFilter}
                        onChange={(e) => {
                          setPurchasesFilter(e.target.value);
                          setPurchasesPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="paid">Paid</option>
                        <option value="in_progress">In Progress</option>
                        <option value="abandoned">Abandoned</option>
                        <option value="issues">Issues (24h+)</option>
                      </Form.Control>
                    </Col>
                    <Col md={4}>
                      <Form.Label>Search email</Form.Label>
                      <Form.Control
                        value={purchasesEmail}
                        onChange={(e) => setPurchasesEmail(e.target.value)}
                        placeholder="customer@email.com"
                      />
                    </Col>
                    <Col md={2}>
                      <Button variant="primary" onClick={loadPurchases}>
                        Refresh
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  {purchasesLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Customer</th>
                          <th>Email</th>
                          <th>Link ID</th>
                          <th>Stage</th>
                          <th>Last Activity</th>
                          <th>Amount</th>
                          <th>Modules</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchasesRows.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center text-muted py-4">
                              No records found
                            </td>
                          </tr>
                        ) : (
                          purchasesRows.map((row) => (
                            <Fragment key={row.linkId}>
                            <tr style={row.isStuck ? { background: "#fff3cd" } : {}}>
                              <td>
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() =>
                                    setExpandedPurchaseLinkId(
                                      expandedPurchaseLinkId === row.linkId
                                        ? null
                                        : row.linkId,
                                    )
                                  }
                                >
                                  {expandedPurchaseLinkId === row.linkId ? "−" : "+"}
                                </Button>
                              </td>
                              <td>{row.customerName || "—"}</td>
                              <td>{row.customerEmail || "—"}</td>
                              <td>
                                <code style={{ fontSize: "11px" }}>{row.linkId}</code>
                              </td>
                              <td>
                                <Badge variant={row.funnelStage === "payment_completed" ? "success" : "warning"}>
                                  {FUNNEL_STAGE_LABELS[row.funnelStage] || row.funnelStage}
                                </Badge>
                                {row.isStuck && <Badge variant="danger" className="ml-1">Issue</Badge>}
                              </td>
                              <td>
                                {row.lastActivity
                                  ? new Date(row.lastActivity).toLocaleString()
                                  : "—"}
                              </td>
                              <td>
                                {row.purchase?.paymentDetails?.grandTotal != null
                                  ? `$${row.purchase.paymentDetails.grandTotal}`
                                  : "—"}
                              </td>
                              <td>
                                {(row.purchase?.selectedModules || row.modules || [])
                                  .map((m) => m.moduleName || m.name)
                                  .filter(Boolean)
                                  .join(", ") || "—"}
                              </td>
                            </tr>
                            {expandedPurchaseLinkId === row.linkId && (
                              <tr key={`${row.linkId}-details`}>
                                <td colSpan={8} style={{ background: "#f8f9fa" }}>
                                  <div className="p-3">
                                    <strong>Event timeline</strong>
                                    <ul className="mb-2 mt-2">
                                      {(row.funnelEvents || []).map((event, idx) => (
                                        <li key={idx}>
                                          {FUNNEL_STAGE_LABELS[event.stage] || event.stage} —{" "}
                                          {event.at
                                            ? new Date(event.at).toLocaleString()
                                            : "—"}
                                        </li>
                                      ))}
                                    </ul>
                                    {row.purchase?.paymentInfo?.stripeSessionId && (
                                      <p className="mb-0">
                                        <strong>Stripe session:</strong>{" "}
                                        {row.purchase.paymentInfo.stripeSessionId}
                                      </p>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                            </Fragment>
                          ))
                        )}
                      </tbody>
                    </Table>
                  )}

                  {purchasesTotalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={purchasesPage <= 1}
                        onClick={() => setPurchasesPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <span>Page {purchasesPage} of {purchasesTotalPages}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={purchasesPage >= purchasesTotalPages}
                        onClick={() => setPurchasesPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {activeTab === "requests" && (
            <>
              <Card className="mb-4">
                <Card.Body>
                  <Row className="align-items-end">
                    <Col md={3}>
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        value={requestsFilter}
                        onChange={(e) => {
                          setRequestsFilter(e.target.value);
                          setRequestsPage(1);
                        }}
                      >
                        <option value="all">All</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </Form.Control>
                    </Col>
                    <Col md={4}>
                      <Form.Label>Search email</Form.Label>
                      <Form.Control
                        value={requestsEmail}
                        onChange={(e) => setRequestsEmail(e.target.value)}
                        placeholder="customer@email.com"
                      />
                    </Col>
                    <Col md={2}>
                      <Button variant="primary" onClick={loadRequests}>
                        Refresh
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  {requestsLoading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Company</th>
                          <th>Phone</th>
                          <th>Module</th>
                          <th>Message</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requestsRows.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="text-center text-muted py-4">
                              No contact requests yet
                            </td>
                          </tr>
                        ) : (
                          requestsRows.map((row) => (
                            <tr
                              key={row._id}
                              style={row.status === "new" ? { background: "#f0f7ff" } : {}}
                            >
                              <td style={{ whiteSpace: "nowrap" }}>
                                {row.createdAt
                                  ? new Date(row.createdAt).toLocaleString()
                                  : "—"}
                              </td>
                              <td>{row.name || "—"}</td>
                              <td>
                                <a href={`mailto:${row.email}`}>{row.email}</a>
                              </td>
                              <td>{row.company || "—"}</td>
                              <td>{row.phone || "—"}</td>
                              <td>{row.moduleName || row.moduleId || "—"}</td>
                              <td style={{ maxWidth: "240px" }}>
                                {row.message || "—"}
                              </td>
                              <td>
                                <Badge
                                  variant={
                                    row.status === "resolved"
                                      ? "success"
                                      : row.status === "contacted"
                                        ? "info"
                                        : "warning"
                                  }
                                >
                                  {row.status || "new"}
                                </Badge>
                              </td>
                              <td>
                                <Form.Control
                                  as="select"
                                  size="sm"
                                  value={row.status || "new"}
                                  onChange={(e) =>
                                    handleRequestStatusChange(row._id, e.target.value)
                                  }
                                  style={{ minWidth: "110px" }}
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="resolved">Resolved</option>
                                </Form.Control>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  )}

                  {requestsTotalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={requestsPage <= 1}
                        onClick={() => setRequestsPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <span>Page {requestsPage} of {requestsTotalPages}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={requestsPage >= requestsTotalPages}
                        onClick={() => setRequestsPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {/* Delete Confirmation Modal */}
          <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Delete Pricing Link</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete the pricing link for{" "}
                <strong>{linkToDelete?.userInfo?.name}</strong>?
              </p>
              <p className="text-muted mb-0">
                This action cannot be undone. The link will no longer be accessible.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setDeleteModalShow(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteLink} disabled={deleting}>
                {deleting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </LayoutTwo>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(DynamicPricing);
