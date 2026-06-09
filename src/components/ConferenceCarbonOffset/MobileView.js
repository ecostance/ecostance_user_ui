import React, { useState, useEffect } from "react";
import MobileStepIndicator from "./MobileStepIndicator";
import MobileBottomBar from "./MobileBottomBar";
import MobileStepEventInfo from "./MobileStepEventInfo";
import MobileStepTravelingTo from "./MobileStepTravelingTo";
import MobileStepLocal from "./MobileStepLocal";

const TAB_MAP = ["ConferenceInfo", "TravelTo", "Local"];

export default function MobileView({
  // Country
  countryList,
  userCountry,
  showCapitalName,
  showCapitalCarbon,
  countryCodeISO3,
  handleSelectCountry,
  // Event
  eventSelection,
  conferenceCode,
  validText,
  eventType,
  conferenceName,
  conferenceDate,
  conferenceEndDate,
  conferenceLocation,
  handleChangeCode,
  inputRef,
  setConferenceName,
  setConferenceDate,
  setConferenceEndDate,
  // Dates
  departureDate,
  arrivalDate,
  // Travel
  travelSelection,
  seatType,
  eventTransportMode,
  distEventTravel,
  // Airport
  searchAirport,
  searchAirportDest,
  searchAirportTrans1,
  searchAirportTrans2,
  airportsData,
  airportsDataDest,
  airportsDataTrans1,
  airportsDataTrans2,
  clickedDrop,
  clickedDropDest,
  clickedDropTrans1,
  clickedDropTrans2,
  handleAirport,
  handleAirportDest,
  handleAirportTrans1,
  handleAirportTrans2,
  handleClickedAirport,
  loadingAirports,
  trans1err,
  trans2err,
  // Local
  transportMode,
  distTravel,
  theStay,
  expenses,
  // Exhibitor
  companyCode,
  companyName,
  theValidField,
  exhibitSpace,
  peopleNum,
  peopleByAir,
  peopleByRoad,
  selectedGroup,
  handlePeople,
  setCompanyCode,
  // Main handler
  handleCalculateCarbonTrans,
  // Output
  totalCarbon,
  perAttendieEmission,
  handleContinue,
  continueClicked,
  // Sync
  setActiveTab,
}) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setActiveTab(TAB_MAP[currentStep]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="mobile-conference-wizard">
      <MobileStepIndicator currentStep={currentStep} />

      {currentStep === 0 && (
        <MobileStepEventInfo
          countryList={countryList}
          userCountry={userCountry}
          showCapitalName={showCapitalName}
          showCapitalCarbon={showCapitalCarbon}
          countryCodeISO3={countryCodeISO3}
          handleSelectCountry={handleSelectCountry}
          eventSelection={eventSelection}
          conferenceCode={conferenceCode}
          validText={validText}
          eventType={eventType}
          conferenceName={conferenceName}
          conferenceDate={conferenceDate}
          conferenceEndDate={conferenceEndDate}
          conferenceLocation={conferenceLocation}
          handleChangeCode={handleChangeCode}
          inputRef={inputRef}
          setConferenceName={setConferenceName}
          setConferenceDate={setConferenceDate}
          setConferenceEndDate={setConferenceEndDate}
          departureDate={departureDate}
          arrivalDate={arrivalDate}
          handleCalculateCarbonTrans={handleCalculateCarbonTrans}
        />
      )}

      {currentStep === 1 && (
        <MobileStepTravelingTo
          eventSelection={eventSelection}
          travelSelection={travelSelection}
          seatType={seatType}
          eventTransportMode={eventTransportMode}
          distEventTravel={distEventTravel}
          handleCalculateCarbonTrans={handleCalculateCarbonTrans}
          searchAirport={searchAirport}
          searchAirportDest={searchAirportDest}
          searchAirportTrans1={searchAirportTrans1}
          searchAirportTrans2={searchAirportTrans2}
          airportsData={airportsData}
          airportsDataDest={airportsDataDest}
          airportsDataTrans1={airportsDataTrans1}
          airportsDataTrans2={airportsDataTrans2}
          clickedDrop={clickedDrop}
          clickedDropDest={clickedDropDest}
          clickedDropTrans1={clickedDropTrans1}
          clickedDropTrans2={clickedDropTrans2}
          handleAirport={handleAirport}
          handleAirportDest={handleAirportDest}
          handleAirportTrans1={handleAirportTrans1}
          handleAirportTrans2={handleAirportTrans2}
          handleClickedAirport={handleClickedAirport}
          loadingAirports={loadingAirports}
          trans1err={trans1err}
          trans2err={trans2err}
          companyCode={companyCode}
          companyName={companyName}
          theValidField={theValidField}
          exhibitSpace={exhibitSpace}
          peopleNum={peopleNum}
          peopleByAir={peopleByAir}
          peopleByRoad={peopleByRoad}
          selectedGroup={selectedGroup}
          handlePeople={handlePeople}
          setCompanyCode={setCompanyCode}
          eventType={eventType}
        />
      )}

      {currentStep === 2 && (
        <MobileStepLocal
          transportMode={transportMode}
          distTravel={distTravel}
          theStay={theStay}
          expenses={expenses}
          handleCalculateCarbonTrans={handleCalculateCarbonTrans}
        />
      )}

      <MobileBottomBar
        currentStep={currentStep}
        totalCarbon={totalCarbon}
        onBack={handleBack}
        onNext={handleNext}
        onContinue={handleContinue}
        continueClicked={continueClicked}
        showCapitalName={showCapitalName}
        showCapitalCarbon={showCapitalCarbon}
        perAttendieEmission={perAttendieEmission}
        eventSelection={eventSelection}
      />
    </div>
  );
}
