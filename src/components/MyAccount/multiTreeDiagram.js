import React, { useEffect, useState, useMemo } from "react";
import { IoIosClose } from "react-icons/io";
import { IoMdRefresh } from "react-icons/io";
import { countryNameToISO3 } from "src/data/countryNameToISO3";
import { returnReverseCode } from "src/data/countryCodeToISO3";
import flagUrlByIso3 from "src/helpers/getFlag";
// import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper function to get country flag URL from country name
const getCountryFlagUrl = (countryName) => {
  if (!countryName) return null;

  // Handle comma-separated countries - take the first one
  const firstCountry = countryName.split(",")[0].trim();

  // Convert country name to ISO2 code
  const iso2Code = countryNameToISO3(firstCountry);
  if (!iso2Code) return null;

  // Convert ISO2 to ISO3 code
  const iso3Code = returnReverseCode(iso2Code);
  if (!iso3Code) return null;

  // Get flag URL from ISO3 code
  return flagUrlByIso3[iso3Code] || null;
};

// Sample data structure with text for nodes and connection lines
const initialTreeData = {
  businessName: "ABCD TEXTILES",
  primaryName: 0,
  children: [
    {
      _id: "6800d435f4695469c4c5eeb1",
      userId: "6800d35df4695469c4c5eca8",
      chainBusinessId: "6800d3a4f4695469c4c5ed37",
      chainUserId: "6800d35df4695469c4c5eca8",
      chainBusinessName: "JKL TEXTILES",
      businessName: "ABCD TEXTILES",
      relationship: "distributor",
      primaryName: "fgh",
      primaryEmail: "fgh@gmail.com",
      alternateName: "ghi",
      alternateEmail: "ghi@gmail.com",
      status: "active",
      createdAt: "2025-04-17T10:13:09.790Z",
      updatedAt: "2025-04-17T10:13:09.790Z",
      __v: 0,
      chain: [],
      position: "left",
    },
    {
      _id: "6800d40bf4695469c4c5ee90",
      userId: "6800d35df4695469c4c5eca8",
      chainBusinessId: "6800d3a4f4695469c4c5ed37",
      chainUserId: "6800d35df4695469c4c5eca8",
      chainBusinessName: "DEF TEXTILES",
      businessName: "ABCD TEXTILES",
      relationship: "supplier",
      primaryName: "abcd",
      primaryEmail: "abcd@gmail.com",
      alternateName: "def",
      alternateEmail: "def@gmail.com",
      status: "active",
      createdAt: "2025-04-17T10:12:27.420Z",
      updatedAt: "2025-04-17T10:12:27.420Z",
      __v: 0,
      children: [
        {
          _id: "67ebbf87c0d6bea24e32cecb",
          userId: "67d04c9607b99193a04f06fd",
          chainBusinessId: "67ce89f4bb53d88985d458ca",
          chainUserId: "67c941e9d86b4cdd714afdb9",
          chainBusinessName: "xyz textiles",
          businessName: "ABCD TEXTILES",
          relationship: "supplier",
          primaryName: "jake john",
          primaryEmail: "1234567890",
          alternateName: "brian lara",
          alternateEmail: "0987654321",
          status: "active",
          createdAt: "2025-04-01T10:27:19.367Z",
          updatedAt: "2025-04-01T10:27:19.367Z",
          __v: 0,
          businessId: "67d04cca07b99193a04f082d",
          depthLevel: 1,
          position: "left",
          children: [
            {
              _id: "67ebce02c0d6bea24e32d47e",
              userId: "67c941e9d86b4cdd714afdb9",
              chainBusinessId: "67b7186a128eb1fa642366a3",
              chainUserId: "67b7182e128eb1fa64236620",
              chainBusinessName: "new textile business",
              businessName: "ABCD TEXTILES",
              relationship: "supplier",
              primaryName: "brian",
              primaryEmail: "abcd@gmail.com",
              alternateName: "lara",
              alternateEmail: "def@gmail.com",
              status: "active",
              createdAt: "2025-04-01T11:29:06.224Z",
              updatedAt: "2025-04-01T11:29:06.224Z",
              __v: 0,
              businessId: "67ce89f4bb53d88985d458ca",
              depthLevel: 2,
              position: "left",
              children: [
                {
                  _id: "67ebce02c0d6bea24e32d47e",
                  userId: "67c941e9d86b4cdd714afdb9",
                  chainBusinessId: "67b7186a128eb1fa642366a3",
                  chainUserId: "67b7182e128eb1fa64236620",
                  chainBusinessName: "new own business",
                  businessName: "ABCD TEXTILES",
                  relationship: "supplier",
                  primaryName: "brian",
                  primaryEmail: "abcd@gmail.com",
                  alternateName: "lara",
                  alternateEmail: "def@gmail.com",
                  status: "active",
                  createdAt: "2025-04-01T11:29:06.224Z",
                  updatedAt: "2025-04-01T11:29:06.224Z",
                  __v: 0,
                  businessId: "67ce89f4bb53d88985d458ca",
                  depthLevel: 2,
                  position: "left",
                  children: [
                    {
                      _id: "67ebce02c0d6bea24e32d47e",
                      userId: "67c941e9d86b4cdd714afdb9",
                      chainBusinessId: "67b7186a128eb1fa642366a3",
                      chainUserId: "67b7182e128eb1fa64236620",
                      chainBusinessName: "MY TEXTILES",
                      businessName: "ABCD TEXTILES",
                      relationship: "supplier",
                      primaryName: "brian",
                      primaryEmail: "abcd@gmail.com",
                      alternateName: "lara",
                      alternateEmail: "def@gmail.com",
                      status: "active",
                      createdAt: "2025-04-01T11:29:06.224Z",
                      updatedAt: "2025-04-01T11:29:06.224Z",
                      __v: 0,
                      businessId: "67ce89f4bb53d88985d458ca",
                      depthLevel: 2,
                      position: "left",
                      children: [
                        {
                          _id: "67ebce02c0d6bea24e32d47e",
                          userId: "67c941e9d86b4cdd714afdb9",
                          chainBusinessId: "67b7186a128eb1fa642366a3",
                          chainUserId: "67b7182e128eb1fa64236620",
                          chainBusinessName: "S1",
                          businessName: "ABCD TEXTILES",
                          relationship: "supplier",
                          primaryName: "brian",
                          primaryEmail: "abcd@gmail.com",
                          alternateName: "lara",
                          alternateEmail: "def@gmail.com",
                          status: "active",
                          createdAt: "2025-04-01T11:29:06.224Z",
                          updatedAt: "2025-04-01T11:29:06.224Z",
                          __v: 0,
                          businessId: "67ce89f4bb53d88985d458ca",
                          depthLevel: 2,
                          position: "left",
                          children: [],
                        },
                        {
                          _id: "67ebce02c0d6bea24e32d47e",
                          userId: "67c941e9d86b4cdd714afdb9",
                          chainBusinessId: "67b7186a128eb1fa642366a3",
                          chainUserId: "67b7182e128eb1fa64236620",
                          chainBusinessName: "S2",
                          businessName: "ABCD TEXTILES",
                          relationship: "supplier",
                          primaryName: "brian",
                          primaryEmail: "abcd@gmail.com",
                          alternateName: "lara",
                          alternateEmail: "def@gmail.com",
                          status: "active",
                          createdAt: "2025-04-01T11:29:06.224Z",
                          updatedAt: "2025-04-01T11:29:06.224Z",
                          __v: 0,
                          businessId: "67ce89f4bb53d88985d458ca",
                          depthLevel: 2,
                          position: "left",
                          children: [],
                        },
                      ],
                    },
                    {
                      _id: "67ebce02c0d6bea24e32d47e",
                      userId: "67c941e9d86b4cdd714afdb9",
                      chainBusinessId: "67b7186a128eb1fa642366a3",
                      chainUserId: "67b7182e128eb1fa64236620",
                      chainBusinessName: "MY TEXTILES 2",
                      businessName: "ABCD TEXTILES",
                      relationship: "supplier",
                      primaryName: "brian",
                      primaryEmail: "abcd@gmail.com",
                      alternateName: "lara",
                      alternateEmail: "def@gmail.com",
                      status: "active",
                      createdAt: "2025-04-01T11:29:06.224Z",
                      updatedAt: "2025-04-01T11:29:06.224Z",
                      __v: 0,
                      businessId: "67ce89f4bb53d88985d458ca",
                      depthLevel: 2,
                      position: "left",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          _id: "6800d435f4695469c4c5eeb1",
          userId: "6800d35df4695469c4c5eca8",
          chainBusinessId: "6800d3a4f4695469c4c5ed37",
          chainUserId: "6800d35df4695469c4c5eca8",
          chainBusinessName: "PLK TEXTILES",
          businessName: "ABCD TEXTILES",
          relationship: "distributor",
          primaryName: "fgh",
          primaryEmail: "fgh@gmail.com",
          alternateName: "ghi",
          alternateEmail: "ghi@gmail.com",
          status: "active",
          createdAt: "2025-04-17T10:13:09.790Z",
          updatedAt: "2025-04-17T10:13:09.790Z",
          __v: 0,
          chain: [],
          position: "left",
        },
      ],
      position: "left",
    },
    {
      _id: "6800d435f4695469c4c5eeb1",
      userId: "6800d35df4695469c4c5eca8",
      chainBusinessId: "6800d3a4f4695469c4c5ed37",
      chainUserId: "6800d35df4695469c4c5eca8",
      chainBusinessName: "FGHF TEXTILES",
      businessName: "ABCD TEXTILES",
      relationship: "distributor",
      primaryName: "fgh",
      primaryEmail: "fgh@gmail.com",
      alternateName: "ghi",
      alternateEmail: "ghi@gmail.com",
      status: "active",
      createdAt: "2025-04-17T10:13:09.790Z",
      updatedAt: "2025-04-17T10:13:09.790Z",
      __v: 0,
      chain: [],
      position: "left",
    },
    {
      _id: "6800d435f4695469c4c5eeb1",
      userId: "6800d35df4695469c4c5eca8",
      chainBusinessId: "6800d3a4f4695469c4c5ed37",
      chainUserId: "6800d35df4695469c4c5eca8",
      chainBusinessName: "FGH TEXTILES",
      businessName: "ABCD TEXTILES",
      relationship: "distributor",
      primaryName: "fgh",
      primaryEmail: "fgh@gmail.com",
      alternateName: "ghi",
      alternateEmail: "ghi@gmail.com",
      status: "active",
      createdAt: "2025-04-17T10:13:09.790Z",
      updatedAt: "2025-04-17T10:13:09.790Z",
      __v: 0,
      chain: [],
      position: "right",
    },
    {
      _id: "6800d435f4695469c4c5eeb1",
      userId: "6800d35df4695469c4c5eca8",
      chainBusinessId: "6800d3a4f4695469c4c5ed37",
      chainUserId: "6800d35df4695469c4c5eca8",
      chainBusinessName: "RAM TEXTILES",
      businessName: "ABCD TEXTILES",
      relationship: "distributor",
      primaryName: "fgh",
      primaryEmail: "fgh@gmail.com",
      alternateName: "ghi",
      alternateEmail: "ghi@gmail.com",
      status: "active",
      createdAt: "2025-04-17T10:13:09.790Z",
      updatedAt: "2025-04-17T10:13:09.790Z",
      __v: 0,
      chain: [],
      position: "right",
    },
  ],
};

const updateBusinessNames = (data) => {
  // Create a deep copy to avoid mutating the original data
  const updatedData = JSON.parse(JSON.stringify(data));

  // Function to recursively process nodes and their children
  const processNode = (node) => {
    // Update businessName to match chainBusinessName for the current node
    if (node.chainBusinessName && node.businessName) {
      node.businessName = node.chainBusinessName;
    }

    // Process children recursively if they exist
    if (
      node.children &&
      Array.isArray(node.children) &&
      node.children.length > 0
    ) {
      node.children.forEach((child) => processNode(child));
    }
  };

  // Handle API response structure - use treeData array if available
  if (updatedData.treeData && Array.isArray(updatedData.treeData)) {
    // Use the treeData array which already contains both suppliers and distributors
    updatedData.children = updatedData.treeData;

    // Process each child
    updatedData.children.forEach((child) => processNode(child));
  }
  // Fallback: combine treeDataSupplier and treeDataDistributor into children
  else if (updatedData.treeDataSupplier || updatedData.treeDataDistributor) {
    const children = [];

    // Add suppliers
    if (
      updatedData.treeDataSupplier &&
      Array.isArray(updatedData.treeDataSupplier)
    ) {
      children.push(...updatedData.treeDataSupplier);
    }

    // Add distributors
    if (
      updatedData.treeDataDistributor &&
      Array.isArray(updatedData.treeDataDistributor)
    ) {
      children.push(...updatedData.treeDataDistributor);
    }

    updatedData.children = children;

    // Process each child
    updatedData.children.forEach((child) => processNode(child));
  }
  // Handle existing children structure
  else if (updatedData.children && Array.isArray(updatedData.children)) {
    updatedData.children.forEach((child) => processNode(child));
  }

  // Set the main business name from businessData if available
  if (updatedData.businessData && updatedData.businessData.name) {
    updatedData.businessName = updatedData.businessData.name;
  }

  // Process the root node itself (in case it has chainBusinessName)
  if (updatedData.chainBusinessName && updatedData.businessName) {
    updatedData.businessName = updatedData.chainBusinessName;
  }

  return updatedData;
};

// Recursive function to calculate all node positions with improved spacing
const calculateNodePositions = (rootNode, centerX, centerY, options = {}) => {
  const {
    level = 0,
    startAngle = 0,
    endAngle = Math.PI * 2,
    radius = 220, // Increased base radius for better spacing
    radiusStep = 140, // Increased radius step for better node separation
    parentAngle = null,
  } = options;

  const positions = {};

  // Set position for the root node
  positions[rootNode.businessName] = {
    x: centerX,
    y: centerY,
    level,
    angle: parentAngle || 0,
    primaryName: rootNode.primaryName,
  };

  // If this node has children, calculate their positions
  if (rootNode.children && rootNode.children.length > 0) {
    // Filter nodes by position for distribution
    const leftNodes = rootNode.children.filter(
      (node) => node.position === "left",
    );
    const rightNodes = rootNode.children.filter(
      (node) => node.position === "right",
    );

    // For first level, split left and right
    if (level === 0) {
      // Left nodes occupy the left half - improved angle distribution
      if (leftNodes.length > 0) {
        const leftStep = Math.PI / (leftNodes.length + 1);
        leftNodes.forEach((node, index) => {
          // Using PI/2 to PI for left side (top-left quadrant)
          const angle = Math.PI / 2 + leftStep * (index + 1);
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          positions[node.businessName] = {
            x,
            y,
            level: level + 1,
            angle,
            primaryName: node.primaryName,
          };

          // Recursively calculate positions for this node's children
          if (node.children && node.children.length > 0) {
            const childPositions = calculateNodePositions(node, x, y, {
              level: level + 1,
              startAngle: angle - Math.PI / 4,
              endAngle: angle + Math.PI / 4,
              radius: radiusStep,
              radiusStep,
              parentAngle: angle,
            });

            // Merge child positions into the result
            Object.assign(positions, childPositions);
          }
        });
      }

      // Right nodes occupy the right half - improved angle distribution
      if (rightNodes.length > 0) {
        const rightStep = Math.PI / (rightNodes.length + 1);
        rightNodes.forEach((node, index) => {
          // Using -PI/2 to PI/2 for right side (right half)
          const angle = -Math.PI / 2 + rightStep * (index + 1);
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          positions[node.businessName] = {
            x,
            y,
            level: level + 1,
            angle,
            primaryName: node.primaryName,
          };

          // Recursively calculate positions for this node's children
          if (node.children && node.children.length > 0) {
            const childPositions = calculateNodePositions(node, x, y, {
              level: level + 1,
              startAngle: angle - Math.PI / 4,
              endAngle: angle + Math.PI / 4,
              radius: radiusStep,
              radiusStep,
              parentAngle: angle,
            });

            // Merge child positions into the result
            Object.assign(positions, childPositions);
          }
        });
      }
    } else {
      // For deeper levels, distribute within the angle range with improved spacing
      const allNodes = rootNode.children;
      if (allNodes.length > 0) {
        // Add padding to angle range to prevent overlapping
        const paddedStartAngle = startAngle + Math.PI / 16;
        const paddedEndAngle = endAngle - Math.PI / 16;
        const angleStep = (paddedEndAngle - paddedStartAngle) / allNodes.length;

        allNodes.forEach((node, index) => {
          const angle = paddedStartAngle + angleStep * index + angleStep / 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          positions[node.businessName] = {
            x,
            y,
            level: level + 1,
            angle,
            primaryName: node.primaryName,
          };

          // Recursively calculate positions for this node's children
          if (node.children && node.children.length > 0) {
            const childPositions = calculateNodePositions(node, x, y, {
              level: level + 1,
              startAngle: angle - Math.PI / 5,
              endAngle: angle + Math.PI / 5,
              radius: radiusStep, // Slightly reduced to maintain fan-out effect
              radiusStep: radiusStep,
              parentAngle: angle,
            });

            // Merge child positions into the result
            Object.assign(positions, childPositions);
          }
        });
      }
    }
  }

  return positions;
};

// Find all connections in the tree
const findAllConnections = (node, connections = [], parent = null) => {
  if (parent) {
    connections.push({
      from: parent.businessName,
      to: node.businessName,
      level: parent.level,
      text: node.alternateName || "",
    });
  }

  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => {
      findAllConnections(child, connections, {
        businessName: node.businessName,
        level: parent ? parent.level + 1 : 0,
      });
    });
  }

  return connections;
};

// Helper to get all nodes in tree
const getAllNodes = (node, result = []) => {
  result.push(node);
  if (node.children && node.children.length > 0) {
    node.children.forEach((child) => getAllNodes(child, result));
  }
  return result;
};

export default function MultiLevelTreeDiagram({
  viewVisual,
  setViewVisual,
  visualData,
}) {
  let thevisual = updateBusinessNames(visualData);
  thevisual.children = thevisual.children.filter(
    (obj) => Object.keys(obj).length !== 0,
  );
  const [treeData, setTreeData] = useState(thevisual);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [viewBoxOffset, setViewBoxOffset] = useState(0);
  const [boundaries, setBoundaries] = useState({ min: 0, max: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch business data on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        // Make API call to get fresh business data
        const response = await fetch(
          `${process.env.API_BASE}/v1/user-chains/tree/${userId}`,
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const updatedVisual = updateBusinessNames(data.data);

            // Safely filter children if they exist
            if (
              updatedVisual.children &&
              Array.isArray(updatedVisual.children)
            ) {
              updatedVisual.children = updatedVisual.children.filter(
                (obj) => Object.keys(obj).length !== 0,
              );
            }

            setTreeData(updatedVisual);
          }
        }
      } catch (error) {
        console.error("Error fetching business data on mount:", error);
      }
    };

    // Only fetch if we don't have business data
    if (!treeData.businessData || !treeData.businessData.co2Emission) {
      fetchBusinessData();
    }
  }, []); // Empty dependency array means this runs only on mount

  // Canvas setup - increased size
  const width = 1400;
  const height = 950;
  const centerX = width / 2;
  const centerY = height / 2;
  const visibleWidth = 800; // Width of the visible area

  // Calculate all node positions - memoized to prevent infinite re-renders
  const allPositions = useMemo(() => {
    return calculateNodePositions(treeData, centerX, centerY);
  }, [treeData, centerX, centerY]);

  // Find all connections - memoized
  const connections = useMemo(() => {
    return findAllConnections(treeData);
  }, [treeData]);

  // Get all nodes - memoized
  const allNodes = useMemo(() => {
    return getAllNodes(treeData);
  }, [treeData]);

  // Calculate boundaries for horizontal scrolling
  useEffect(() => {
    let minX = centerX;
    let maxX = centerX;

    // Find the minimum and maximum X coordinates
    Object.values(allPositions).forEach((pos) => {
      if (pos.x < minX) minX = pos.x;
      if (pos.x > maxX) maxX = pos.x;
    });

    // Add padding
    minX -= 100;
    maxX += 100;

    setBoundaries({ min: minX, max: maxX });
  }, [allPositions]);

  const handleScrollLeft = () => {
    // Math.max(viewBoxOffset - 200, boundaries.min - centerX);
    const newOffset = Math.max(viewBoxOffset - 200, boundaries.min - centerX);
    setViewBoxOffset(newOffset);
  };

  const handleScrollRight = () => {
    // Math.min(viewBoxOffset + 200, boundaries.max - centerX - visibleWidth);
    const newOffset = Math.min(viewBoxOffset + 200, boundaries.max - centerX);
    console.log(newOffset, "offsett");
    setViewBoxOffset(newOffset);
  };

  const handleNodeClick = (nodeName) => {
    setSelectedNode(nodeName === selectedNode ? null : nodeName);
  };

  const handleNodeHover = (nodeName) => {
    setHoveredNode(nodeName);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem("userId");

      if (!userId) {
        console.error("User ID not found in localStorage");
        alert("User ID not found. Please login again.");
        return;
      }

      console.log("Refreshing tree data for userId:", userId);

      // Make API call to refresh tree data
      const response = await fetch(
        `${process.env.API_BASE}/v1/user-chains/tree/${userId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success && data.data) {
        // Update the tree data with fresh data
        const updatedVisual = updateBusinessNames(data.data);

        // Safely filter children if they exist
        if (updatedVisual.children && Array.isArray(updatedVisual.children)) {
          updatedVisual.children = updatedVisual.children.filter(
            (obj) => Object.keys(obj).length !== 0,
          );
        }

        setTreeData(updatedVisual);
        console.log("Tree data updated successfully");
      } else {
        console.error("API response not successful:", data);
        alert("Failed to refresh data. Please try again.");
      }
    } catch (error) {
      console.error("Error refreshing tree data:", error);
      alert("Error refreshing data: " + error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Helper to get node size based on level
  const getNodeSize = (nodeName) => {
    const level = allPositions[nodeName]?.level || 0;
    // Make the size difference more pronounced
    const baseSize = 14; // Slightly larger base size
    return baseSize - level * 2; // More significant reduction with depth
  };

  // Improved function to calculate the midpoint and offset for connection text
  const calculateTextPosition = (x1, y1, x2, y2) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Calculate perpendicular vector for text offset
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Normalize and create perpendicular vector (rotate 90 degrees)
    const perpX = -dy / len;
    const perpY = dx / len;

    // Apply offset in perpendicular direction
    const offset = 15; // Increased offset distance
    const offsetX = midX + perpX * offset;
    const offsetY = midY + perpY * offset;

    // Calculate angle for text
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    // Adjust text angle to prevent upside-down text
    let textAngle = angle;
    if (angle > 90 || angle < -90) {
      textAngle = angle + 180;
    }

    return {
      x: offsetX,
      y: offsetY,
      angle: textAngle,
    };
  };

  // Determine if navigation arrows should be shown
  const showLeftArrow = viewBoxOffset > boundaries.min - centerX;
  const showRightArrow = viewBoxOffset < boundaries.max - centerX;

  let theName = JSON.parse(localStorage.getItem("MyBusinessDetails"))?.name;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-800">
        <b>{theName}</b> Supply Chain
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Hover over nodes to see carbon footprints. Click on a node to select it.
      </p>

      <div
        className="relative border rounded p-2 bg-slate-50 overflow-hidden"
        style={{ position: "relative" }}
      >
        <button
          className="cart-overlay__close-icon"
          onClick={() => setViewVisual(false)}
        >
          <IoIosClose />
        </button>

        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            position: "absolute",
            top: "10px",
            right: "50px",
            zIndex: 10,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isRefreshing ? "not-allowed" : "pointer",
            opacity: isRefreshing ? 0.6 : 1,
            transition: "all 0.3s ease",
          }}
        >
          <IoMdRefresh
            style={{
              fontSize: "20px",
              transform: isRefreshing ? "rotate(360deg)" : "rotate(0deg)",
              transition: "transform 0.5s ease",
            }}
          />
        </button>

        {/* Navigation arrows */}
        {showLeftArrow && (
          <button className="left arrow" onClick={handleScrollLeft}></button>
        )}

        {showRightArrow && (
          <button className="right arrow" onClick={handleScrollRight}></button>
        )}

        <div
          className="overflow-hidden"
          style={{ width: "100%", height: height }}
        >
          <svg
            width={width}
            height={height}
            viewBox={`${centerX - visibleWidth / 2 + viewBoxOffset} ${centerY - height / 2} ${visibleWidth} ${height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Draw all connections */}
            {connections.map((connection, index) => {
              const sourcePos = allPositions[connection.from];
              const targetPos = allPositions[connection.to];
              const textPos = calculateTextPosition(
                sourcePos.x,
                sourcePos.y,
                targetPos.x,
                targetPos.y,
              );

              return (
                <g key={`line-${connection.from}-${connection.to}`}>
                  {/* Connection line - solid for all levels */}
                  <line
                    x1={sourcePos.x}
                    y1={sourcePos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke={
                      selectedNode === connection.to ||
                      selectedNode === connection.from
                        ? "#2563eb"
                        : "#94a3b8"
                    }
                    strokeWidth={2.5}
                    className="transition-all duration-300"
                  />

                  {/* Connection text with background for better readability */}
                  {connection.text && (
                    <g>
                      {/* Text background */}
                      <rect
                        x={textPos.x - 40}
                        y={textPos.y - 8}
                        width={80}
                        height={16}
                        rx={8}
                        fill="white"
                        opacity={0.8}
                        transform={`rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`}
                      />
                      {/* Connection text */}
                      <text
                        x={textPos.x}
                        y={textPos.y}
                        textAnchor="middle"
                        fill="#475569"
                        fontSize={10}
                        fontWeight="500"
                        transform={`rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`}
                        className="pointer-events-none"
                      >
                        {connection.text}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Draw all nodes with improved text positioning */}
            {allNodes.map((node) => {
              const nodePos = allPositions[node.businessName];
              if (!nodePos) return null;

              const nodeSize = getNodeSize(node.businessName);
              const isSelected = selectedNode === node.businessName;
              const isHovered = hoveredNode === node.businessName;

              // Improved text positioning - add more space for text
              const textY = nodePos.y + nodeSize + 18;

              // Background for text to prevent line overlaps
              const textWidth = node.businessName.length * 5.5; // Estimate text width
              const textHeight = 16;

              return (
                <g
                  key={node.businessName}
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(node.businessName)}
                  onMouseEnter={() => handleNodeHover(node.businessName)}
                  onMouseLeave={handleNodeLeave}
                >
                  {/* Text background to prevent overlap with lines */}
                  <rect
                    x={nodePos.x - textWidth / 2}
                    y={textY - textHeight / 2}
                    width={textWidth}
                    height={textHeight}
                    rx={8}
                    fill="white"
                    opacity={0.9}
                  />

                  {/* Node circle */}
                  <circle
                    cx={nodePos.x}
                    cy={nodePos.y}
                    r={12}
                    fill={
                      isSelected
                        ? "#2563eb"
                        : node.businessName === treeData.businessName
                          ? "#64748b" // Main business unchanged
                          : node.acceptanceStatus === "pending"
                            ? "#f97316" // Orange for pending
                            : "#22c55e"
                    } // Green for accepted/other status
                    stroke="none"
                    strokeWidth={2}
                    className="transition-all duration-300"
                  />

                  {/* Text below the node */}
                  <text
                    x={nodePos.x}
                    y={textY}
                    textAnchor="middle"
                    fill={
                      isSelected
                        ? "#2563eb"
                        : node.businessName === treeData.businessName
                          ? "#1e293b" // Main business - dark gray
                          : node.acceptanceStatus === "pending"
                            ? "#f97316" // Orange for pending
                            : "#22c55e"
                    } // Green for accepted/other status
                    fontWeight={isSelected ? "bold" : "normal"}
                    fontSize={12}
                    className="transition-all duration-300"
                  >
                    {node.businessName}
                  </text>

                  {/* Hover tooltip */}
                  {isHovered && (
                    <g>
                      {/* Country flag behind everything */}
                      {(() => {
                        const countries =
                          node.businessName === treeData.businessName
                            ? treeData.businessData?.countries || []
                            : node.businessDetails?.countries || [];

                        // Use first country or default to USA
                        const countryToUse =
                          countries && countries.length > 0
                            ? countries[0]
                            : "United States";
                        const flagUrl = getCountryFlagUrl(countryToUse);

                        if (flagUrl) {
                          return (
                            <g>
                              {/* Flag background */}
                              <rect
                                x={nodePos.x - 95}
                                y={nodePos.y + 27}
                                width={20}
                                height={15}
                                fill="#fff"
                                fillOpacity={1}
                                stroke="none"
                                strokeWidth={0}
                                rx={1}
                              />
                              {/* Flag image */}
                              <image
                                x={nodePos.x - 95}
                                y={nodePos.y + 27}
                                width={20}
                                height={15}
                                href={flagUrl}
                                preserveAspectRatio="xMidYMid meet"
                                opacity={1}
                                filter="contrast(2) saturate(2) brightness(1) hue-rotate(0deg) invert(0.1)"
                              />
                            </g>
                          );
                        }
                        return null;
                      })()}

                      {/* Main tooltip border */}
                      <rect
                        x={nodePos.x - 100}
                        y={nodePos.y + 22}
                        width={200}
                        height={120}
                        rx={0}
                        fill="transparent"
                        fillOpacity={1}
                        stroke="#000"
                        strokeWidth={0.5}
                        strokeOpacity={0.2}
                      />

                      {/* White background for text area */}
                      <rect
                        x={nodePos.x - 80}
                        y={nodePos.y + 45}
                        width={160}
                        height={100}
                        rx={0}
                        fill="#fff"
                        fillOpacity={0.9}
                        stroke="none"
                      />
                      <text
                        x={nodePos.x}
                        y={nodePos.y + 50}
                        fill="#000"
                        fontSize={12}
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        <tspan>
                          CO2 Emission:{" "}
                          {node.businessName === treeData.businessName
                            ? treeData.businessData?.co2Emission || 0
                            : node.businessDetails?.co2Emission || 0}{" "}
                          Kgs
                        </tspan>
                      </text>
                      <text
                        x={nodePos.x}
                        y={nodePos.y + 65}
                        fill="#000"
                        fontSize={12}
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        <tspan>
                          Energy Consumption:{" "}
                          {node.businessName === treeData.businessName
                            ? treeData.businessData?.powerConsuption || 0
                            : node.businessDetails?.powerConsuption || 0}{" "}
                          Kwh
                        </tspan>
                      </text>
                      <text
                        x={nodePos.x}
                        y={nodePos.y + 80}
                        fill="#000"
                        fontSize={12}
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        <tspan>
                          Water Usage:{" "}
                          {node.businessName === treeData.businessName
                            ? treeData.businessData?.waterConsuption || 0
                            : node.businessDetails?.waterConsuption || 0}{" "}
                          L
                        </tspan>
                      </text>
                      <text
                        x={nodePos.x}
                        y={nodePos.y + 95}
                        fill="#000"
                        fontSize={12}
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        <tspan>
                          Recycled Material:{" "}
                          {node.businessName === treeData.businessName
                            ? treeData.businessData?.recycleMaterial || 0
                            : node.businessDetails?.recycleMaterial || 0}
                          %
                        </tspan>
                      </text>
                      <text
                        x={nodePos.x}
                        y={nodePos.y + 110}
                        fill="#000"
                        fontSize={12}
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        <tspan>
                          Upcycled Material:{" "}
                          {node.businessName === treeData.businessName
                            ? treeData.businessData?.upcycleMaterial || 0
                            : node.businessDetails?.upcycleMaterial || 0}
                          %
                        </tspan>
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-100 rounded text-sm text-slate-700">
        {selectedNode ? (
          <div>
            <p className="font-semibold text-slate-800">{selectedNode}</p>
            <p className="mt-1">
              Carbon Footprint: {allPositions[selectedNode]?.primaryName} CO2
              Tons
            </p>
          </div>
        ) : (
          <p>
            No node selected. Hover over nodes to see carbon footprint details.
          </p>
        )}
      </div>
    </div>
  );
}
