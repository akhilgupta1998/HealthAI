
import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Health Guardian</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            
            <h2>1. Introduction</h2>
            <p>
              These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at healthguardian.com (together or individually "Service") operated by Health Guardian.
            </p>
            <p>
              Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages.
            </p>
            <p>
              Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.
            </p>
            <p>
              If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at support@healthguardian.com so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.
            </p>
            
            <h2>2. Communications</h2>
            <p>
              By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at support@healthguardian.com.
            </p>
            
            <h2>3. Purchases</h2>
            <p>
              If you wish to purchase any product or service made available through Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.
            </p>
            <p>
              You represent and warrant that: (i) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
            </p>
            <p>
              We may engage the services of third-party service providers to facilitate payment processing and order fulfillment. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.
            </p>
            <p>
              We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
            </p>
            <p>
              We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
            </p>
            
            <h2>4. Subscriptions</h2>
            <p>
              Some parts of Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles will be set depending on the type of subscription plan you select when purchasing a Subscription.
            </p>
            <p>
              At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or Health Guardian cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting support@healthguardian.com customer support team.
            </p>
            <p>
              A valid payment method is required to process the payment for your subscription. You shall provide Health Guardian with accurate and complete billing information that may include but is not limited to full name, address, state, postal or zip code, telephone number, and a valid payment method information. By submitting such payment information, you automatically authorize Health Guardian to charge all Subscription fees incurred through your account to any such payment instruments.
            </p>
            <p>
              Should automatic billing fail to occur for any reason, Health Guardian reserves the right to terminate your access to the Service with immediate effect.
            </p>
            
            <h2>5. Free Trial</h2>
            <p>
              Health Guardian may, at its sole discretion, offer a Subscription with a free trial for a limited period of time ("Free Trial").
            </p>
            <p>
              You may be required to enter your billing information in order to sign up for Free Trial.
            </p>
            <p>
              If you do enter your billing information when signing up for Free Trial, you will not be charged by Health Guardian until Free Trial has expired. On the last day of Free Trial period, unless you cancelled your Subscription, you will be automatically charged the applicable Subscription fees for the type of Subscription you have selected.
            </p>
            <p>
              At any time and without notice, Health Guardian reserves the right to (i) modify Terms of Service of Free Trial offer, or (ii) cancel such Free Trial offer.
            </p>
            
            <h2>6. Fee Changes</h2>
            <p>
              Health Guardian, in its sole discretion and at any time, may modify Subscription fees for the Subscriptions. Any Subscription fee change will become effective at the end of the then-current Billing Cycle.
            </p>
            <p>
              Health Guardian will provide you with a reasonable prior notice of any change in Subscription fees to give you an opportunity to terminate your Subscription before such change becomes effective.
            </p>
            <p>
              Your continued use of Service after Subscription fee change comes into effect constitutes your agreement to pay the modified Subscription fee amount.
            </p>
            
            <h2>7. Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for Content that you post on or through Service, including its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting Content on or through Service, You represent and warrant that: (i) Content is yours (you own it) and/or you have the right to use it and the right to grant us the rights and license as provided in these Terms, and (ii) that the posting of your Content on or through Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or entity. We reserve the right to terminate the account of anyone found to be infringing on a copyright.
            </p>
            <p>
              You retain any and all of your rights to any Content you submit, post or display on or through Service and you are responsible for protecting those rights. We take no responsibility and assume no liability for Content you or any third party posts on or through Service. However, by posting Content using Service you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service. You agree that this license includes the right for us to make your Content available to other users of Service, who may also use your Content subject to these Terms.
            </p>
            <p>
              Health Guardian has the right but not the obligation to monitor and edit all Content provided by users.
            </p>
            <p>
              In addition, Content found on or through this Service are the property of Health Guardian or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.
            </p>
            
            <h2>8. Prohibited Uses</h2>
            <p>
              You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:
            </p>
            <ul>
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
              <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of Service, or which, as determined by us, may harm or offend Company or users of Service or expose them to liability.</li>
            </ul>
            
            <h2>9. Disclaimer</h2>
            <p>
              Health Guardian provides general information and resources about health, nutrition, and fitness. The information is not advice, and should not be treated as such.
            </p>
            <p>
              You must not rely on the information on our website as an alternative to medical advice from your doctor or other professional healthcare provider.
            </p>
            <p>
              If you have any specific questions about any medical matter you should consult your doctor or other professional healthcare provider.
            </p>
            <p>
              If you think you may be suffering from any medical condition you should seek immediate medical attention.
            </p>
            
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at terms@healthguardian.com.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default TermsOfService;
