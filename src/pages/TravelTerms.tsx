import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

const TravelTerms = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/get/village"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Uburu Village
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-[#0f2b41] px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Travel Program Terms and Conditions</h1>
            <p className="text-[#f2c15d] font-medium">Uburu Village - Travel Participation Agreement and Media Consent</p>
          </div>

          <div className="p-8 md:p-12 max-w-none text-gray-700 leading-relaxed space-y-8">
            <section>
              <p className="text-lg font-medium text-gray-900">
                By registering for and participating in any trip, tour, retreat, outreach program, training, or event organized by Uburu Village (or with organization associated with Uburu Village) participants agree to the following terms and conditions:
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">1. Participation and Responsibility</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Participants are responsible for providing accurate personal information and emergency contact details.</li>
                <li>Participants must comply with all local laws, regulations, and instructions provided by the organization and its representatives.</li>
                <li>The organization reserves the right to remove any participant whose behavior poses a risk to themselves, other participants, staff, or the public.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">2. Health and Medical Responsibility</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Participants are responsible for disclosing any relevant medical conditions, allergies, dietary requirements, or special needs before travel.</li>
                <li>Participants must carry any required medications and ensure they are used as prescribed.</li>
                <li>In the event of a medical emergency, the organization may arrange necessary medical treatment. Any associated costs shall be the responsibility of the participant unless otherwise stated.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">3. Travel Risks</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Participants acknowledge that travel may involve certain risks, including delays, accidents, illness, weather-related disruptions, theft, or other unforeseen circumstances.</li>
                <li>The organization will take reasonable measures to ensure participant safety but cannot guarantee the elimination of all risks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">4. Transportation and Accommodation</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Transportation and accommodation arrangements are subject to availability and may be modified due to operational, safety, or unforeseen circumstances.</li>
                <li>Participants are expected to respect accommodation facilities, vehicles, and property used during the trip.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">5. Personal Property</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Participants are responsible for their personal belongings at all times.</li>
                <li>The organization shall not be liable for the loss, theft, or damage of personal property.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">6. Photography and Video Consent</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Participants grant the organization permission to photograph, record, and film them during activities, travel, events, and programs.</li>
                <li>Such photographs, videos, audio recordings, and other media may be used by the organization for educational, promotional, marketing, fundraising, reporting, social media, website content, publications, and other lawful purposes without additional compensation.</li>
                <li>Participants understand that these materials may be shared publicly and may remain in use indefinitely.</li>
                <li>The organization will make reasonable efforts to use images respectfully and in a manner consistent with its mission and values.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">7. Opt-Out of Media Use</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Participants who do not wish to appear in photographs or videos must notify the organization in writing before the commencement of the trip.</li>
                <li>While reasonable efforts will be made to honor such requests, the organization cannot guarantee exclusion from all group photographs, videos, or public event recordings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">8. Liability Waiver</h2>
              <p>
                To the fullest extent permitted by law, participants release and hold harmless the organization, its directors, employees, volunteers, agents, and partners from claims arising from participation in travel activities, except where caused by gross negligence or willful misconduct.
              </p>
            </section>

            <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                9. Changes, Cancellation, and Refund Policy
              </h2>
              <ul className="space-y-3">
                {[
                  "The organization reserves the right to modify itineraries, schedules, destinations, transportation, accommodations, or activities due to safety concerns, weather conditions, government directives, or circumstances beyond its control.",
                  "No refunds shall be issued for cancellations made within seven (7) days of the scheduled departure date, regardless of the reason for cancellation, including personal emergencies, illness, scheduling conflicts, or failure to attend.",
                  "Any payments made within seven (7) days of the travel date are considered final and non-refundable.",
                  "The organization reserves the right to review exceptional circumstances at its sole discretion; however, approval of any refund remains entirely at the organization's discretion.",
                  "Participants may transfer their booking to another eligible participant with prior written approval from the organization.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-amber-800">
                    <span className="text-amber-500 font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">10. Code of Conduct</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Participants shall treat fellow travelers, staff, community members, and partners with dignity and respect.</li>
                <li>Harassment, discrimination, violence, substance abuse, or disruptive behavior may result in immediate removal from the program without refund.</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">11. Consent and Acceptance</h2>
              <p className="mb-4">By signing below, I confirm that:</p>
              <ul className="list-disc pl-5 space-y-2 font-medium">
                <li>I have read and understood these Terms and Conditions.</li>
                <li>I voluntarily agree to participate in the travel program.</li>
                <li>I understand the risks associated with travel.</li>
                <li>I consent to the organization's photography and video policy unless I have submitted a written opt-out request.</li>
                <li>I agree to comply with all program rules and instructions.</li>
              </ul>
            </section>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-gray-900 font-bold bg-yellow-50 px-6 py-4 rounded-2xl border border-yellow-200">
                <CheckCircle2 className="text-yellow-600 h-6 w-6" />
                <span>I have read and accept the terms and conditions above.</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Last updated: June 15, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelTerms;
