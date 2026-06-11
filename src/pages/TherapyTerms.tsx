import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

const TherapyTerms = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-neutral-900 px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Consent Form for Therapy</h1>
            <p className="text-yellow-400 font-medium">Uburu Therapy - Professional services and business policies.</p>
          </div>

          <div className="p-8 md:p-12 max-w-none text-gray-700 leading-relaxed space-y-8">
            <section>
              <p className="text-lg">
                Welcome to the therapeutic practice of <strong className="text-gray-900">UBURU THERAPY</strong>. This document contains important information about our professional services and business policies. It also contains information about our policies and practices to protect the privacy of your health information. Please read this document carefully and let me know if you have any questions or concerns. By signing this document, you will be stating that you were provided with this information and it will represent a binding agreement between us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">Psychotherapy Services</h2>
              <p className="mb-4">
                Psychotherapy varies depending on the therapist, the client and the client’s particular situation and goals. There are many different methods which may be used to deal with a particular situation, goals, and objectives. For the best outcome, each client must choose to invest energy in the process and work actively on relevant topics both during and between sessions.
              </p>
              <p>
                Psychotherapy can have benefits and risks. The risks may include experiencing uncomfortable feelings like sadness, guilt, anger, anxiety or frustration when discussing aspects of life. Psychotherapy has been shown to have benefits that can include better relationships, solutions to specific problems, increased life satisfaction, improved physical health, and significant reductions in feelings of distress. However, there are no guarantees as to what each client will experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">What to Expect</h2>
              <p>
                The first few sessions will involve an evaluation of your situation including needs, goals, and objectives to work toward. Psychotherapy can involve a significant investment of time, energy, and money. It is important to select a therapist with whom you are comfortable working. If at any time you have questions about therapy, please discuss them with me as they arise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">Sessions</h2>
              <p className="mb-4">
                We schedule 1 hour sessions. If you would like longer sessions, the price will be pro-rated according to the length of appointment we agree upon. If you arrive late for an appointment, the remaining time of our scheduled session is available to you if you have called to state you will be late. If you have not called, we may not be available after 15 minutes from the scheduled start time. At times, it may be appropriate to meet more or less than once per week if that is consistent with the agreed upon treatment plan.
              </p>
              <p className="font-semibold text-gray-900 bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400">
                If you need to cancel a scheduled therapy session, you must do so at least 24-hours in advance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">Professional Fees</h2>
              <p>
                Fees are listed on the Counseling Fees document. Package rates are available which can be found on our website (www.uburumultimove.com). In addition to regular sessions, it is policy to charge the therapy rate on a pro-rated basis for other professional services required. Other services include report writing, telephone conversations lasting longer than 15 minutes, attendance at meetings or consultations with other professionals which have been authorized, preparation of records or treatment summaries, and time spent performing any other professional service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">Billing and Payments</h2>
              <p>
                You will be expected to pay the full agreed upon fee before the time of each session unless other arrangements have been made. Payments may be made by cash, mobile money or bank transfers. Payment schedules for other professional services will be agreed upon when/if they are requested.
              </p>
            </section>

            <section className="bg-amber-50 p-8 rounded-3xl border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                Therapy Refund Policy
              </h2>
              <p className="mb-4 font-medium text-amber-900">Please note the following regarding payments and refunds:</p>
              <ul className="space-y-3">
                {[
                  "Therapy session payments are generally non-refundable once payment has been made.",
                  "If a client is unable to attend a scheduled session, the session may be rescheduled for a later date based on availability.",
                  "Paid sessions may also be transferred or donated to another individual if the client chooses not to use them.",
                  "Promotional or discounted therapy sessions are strictly non-refundable.",
                  "Clients are encouraged to communicate cancellations or rescheduling requests in advance to allow proper planning.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-amber-800">
                    <span className="text-amber-500 font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-bold text-amber-900 bg-white/50 p-4 rounded-xl border border-amber-200/50">
                By booking and making payment for therapy services, clients acknowledge and agree to this refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">Social Media Policy</h2>
              <p>
                We do not interact or accept “friend” requests via social media sites (Facebook, LinkedIn, etc) because it has the potential to compromise privacy and complicate our therapeutic relationship.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">Confidentiality</h2>
              <p className="mb-6">
                In general, the law protects the privacy of all communication between a client and a mental health provider. We may only release information about your treatment to others if you sign a written authorization form. You may revoke any such authorizations at any time, which must be in writing.
              </p>
              <p className="font-bold text-gray-900 mb-4 px-4 py-2 bg-gray-50 rounded-lg inline-block">
                However, in the following situations, your authorization is not required to release your personal information:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Therapist’s duty to warn another in the case of potential suicide, homicide or threat of imminent, serious harm to another individual.",
                  "Therapist’s duty to report suspicion of abuse or neglect of children or vulnerable adults.",
                  "Therapist’s duty to report prenatal exposure to illegal substances and excesses.",
                  "Therapist’s duty to report the misconduct of mental health or health care professionals.",
                  "Therapist’s duty to provide a spouse or parent of a deceased client access to their child or spouse’s records.",
                  "Therapist’s duty to provide parents of minor children access to their child’s records.",
                  "Therapist’s duty to release records if subpoenaed by the courts.",
                  "Therapist’s obligations to contracts (e.g. to employer of client, to an insurance carrier or health plan).",
                ].map((item, i) => (
                  <li key={i} className="bg-white border border-gray-100 p-4 rounded-2xl text-sm hover:border-yellow-200 transition-colors shadow-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">Other Client Rights</h2>
              <ul className="space-y-4">
                {[
                  "I have the right to request and receive confidential communication of my protected health information by alternate means or at alternative locations.",
                  "I have the right to request that the therapist change information in my record. I understand I am required to make such requests in writing along with reasons for the requested changes.",
                  "I understand I generally have the right to receive an accounting of any disclosures the therapist has made of protected health information, which did not require client authorization.",
                  "I understand my therapist may use or disclose my health information for treatment purposes including presentation of my case in consultation with other professionals or consultants who are bound by the legal framework of privacy and confidentiality.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                    <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-black text-[10px] font-black rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide text-sm">Safety</h2>
              <p className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-900">
                We strive to provide a safe environment for all. Please let me know immediately if you have concerns for your safety while at our office. You agree that if you engage in verbal, written or physical behavior that is threatening to a therapist or a therapist’s family, or any other person, any therapist may identify you to the police, explain that you are a client, and report the threatening behavior using your personally identifying information.
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 italic">Acknowledgment & Consent</h2>
              <p className="mb-4">
                I understand the basic goals, ideas, and methods of this therapy. I have no important questions or concerns that the therapist has not discussed with me. I understand that reaching the agreed upon therapy goal is not guaranteed. I understand that therapy is successful for some people, moderately successful for others, and for some not successful at all.
              </p>
              <p className="font-bold text-gray-900">
                By using our booking services and checking the agreement box, you are indicating that you have read the information in this document and agree to abide by its terms during the course of therapy.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-gray-900 font-bold bg-yellow-50 px-6 py-4 rounded-2xl border border-yellow-200">
                <CheckCircle2 className="text-yellow-600 h-6 w-6" />
                <span>I have read and accept the terms and conditions above.</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Last updated: May 23, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyTerms;
