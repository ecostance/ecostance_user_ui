import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { getAllOrders } from "src/apiClient/orders";
import { getCurrentSustainabilityPage } from "src/apiClient/sustainability";
import { getMetric } from "src/apiClient/user";
import SustainabilityPage from "src/components/sustainabilityPage";
import NotFound from "../404";
import * as cookie from "cookie";

const Layout = ({ userData, sustainData, data }) => {
  console.log("preview", userData , sustainData , data)
  return (
    <div>
      {userData?.isLoggedIn && data?.success ? (
        <SustainabilityPage
          metricData={data?.metricData}
          allProductData={data?.filteredProducts}
          sustainData={sustainData}
          userData={userData}
        />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return { userData: state.userData, sustainData: state.sustainabilityData };
};

const fetchMetrics = async (token) => {
  try {
    const res = await getMetric(token);
    console.log(res , "metricsss")
    return { fetched: true, ...res.data };
  } catch (err) {
    console.log(err);
  }
};

const setAllOrders = async (token) => {
  return await getAllOrders(1, token);
};

const filteredProductData = (response) => {
  console.log(response , "filterprod")
  const allOrders = response?.data?.data || [];
  // console.log("allOrders", allOrders);
  let allProducts = [];
  for (const each of allOrders) {
    allProducts = [...allProducts, ...each.products];
  }
  const allProjects = [];
  const projectHash = {};

  allProducts.map((each) => {
    if (!projectHash[each?.product?.name]) {
      allProjects.push(each?.product?.name);
      projectHash[each?.product?.name] = true;
    }
  });
  return { allProducts: allOrders, allProjects };
};

export async function getServerSideProps(context) {
  const localCookie = context?.req?.headers?.cookie;
  if (!localCookie) {
    return { props: { data: { success: false } } };
  }

  const JWTToken = cookie.parse(localCookie)?.JWTToken;

  try {
    const metricData = await fetchMetrics(JWTToken);
    const allProductData = await setAllOrders(JWTToken);
    const filteredProducts = filteredProductData(allProductData);

    return { props: { data: { success: true, metricData, filteredProducts } } };
  } catch (err) {
    return { props: { data: { success: false } } };
  }
}

export default connect(mapStateToProps)(Layout);
