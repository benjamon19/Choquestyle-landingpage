import React, { useState } from 'react';
import { reservationContent, features, rules, texts } from './reservationData';
import {
  ReservationTitle,
  ReservationSubtitle,
  FeaturesGrid,
  RulesToggle,
  RulesSection,
  ReservationButton,
} from './ReservationComponents';

const ReservationSection = () => {
  const [showRules, setShowRules] = useState(false);

  const handleReservation = () => {
    window.open(reservationContent.reservationUrl, '_blank');
  };

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <section
      id="reservar"
      className="py-20 px-4 sm:px-6 lg:px-8 w-full relative"
      style={{ backgroundColor: '#1c1c1c' }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <ReservationTitle 
          title={reservationContent.title}
        />
        
        <ReservationSubtitle 
          subtitle={reservationContent.subtitle}
        />
        
        <div
          className="p-8 rounded-xl shadow-2xl"
          style={{
            backgroundColor: '#1E1E1E',
            border: '2px solid #333333',
          }}
        >
          
          <FeaturesGrid features={features} />
          
          <RulesToggle
            showRules={showRules}
            onToggle={toggleRules}
            texts={texts}
          />
          
          <RulesSection
            showRules={showRules}
            rules={rules}
            rulesTitle={texts.rulesTitle}
          />
          
          <ReservationButton
            onReservation={handleReservation}
            buttonText={texts.buttonText}
            buttonSubtext={texts.buttonSubtext}
            defaultKey={texts.defaultKey}
          />
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;