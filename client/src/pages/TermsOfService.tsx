import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sunset-50 via-warmth-50 to-ocean-50 dark:from-sunset-900 dark:via-ocean-900 dark:to-peace-900 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="back-button">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to App
            </Button>
          </Link>
        </div>

        <Card className="glassmorphism">
          <CardContent className="p-8">
            <h1 className="text-3xl font-playfair font-bold text-slate-800 dark:text-white mb-6">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              Last Updated: December 30, 2024
            </p>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  By accessing or using CaptureIt™ (the "Service"), you agree to be bound by these Terms of 
                  Service. If you disagree with any part of these terms, you may not access the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  2. Description of Service
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  CaptureIt™ is a wellness platform that provides AI-powered coaching, biometric tracking, 
                  community features, and mental wellness support. The Service is intended for general 
                  wellness purposes and is not a substitute for professional medical or mental health care.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  3. User Accounts
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Updating your information as needed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  4. Health Disclaimer
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Important:</strong> The Service provides wellness information and AI-assisted guidance 
                  for educational and informational purposes only. It is not intended to diagnose, treat, cure, 
                  or prevent any disease or health condition. Always consult qualified healthcare professionals 
                  for medical advice. In case of a medical emergency, contact emergency services immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  5. AI Features
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Our AI therapy and coaching features are designed to provide supportive conversations and 
                  wellness guidance. They are not a replacement for licensed mental health professionals. 
                  The AI may not always provide accurate or appropriate responses. Use AI features at your 
                  own discretion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  6. Community Guidelines
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  When using community features, you agree not to:
                </p>
                <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                  <li>Post harmful, threatening, or harassing content</li>
                  <li>Share false or misleading health information</li>
                  <li>Violate the privacy of others</li>
                  <li>Engage in spam or commercial solicitation</li>
                  <li>Post content that violates applicable laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  7. Karma System
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Karma points are earned through wellness activities and community engagement. Karma points 
                  have no monetary value and cannot be exchanged for cash. We reserve the right to modify 
                  or discontinue the karma system at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  8. Intellectual Property
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  The Service and its original content, features, and functionality are owned by CaptureIt™ 
                  and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  9. Limitation of Liability
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  To the maximum extent permitted by law, CaptureIt™ shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages resulting from your use of the Service. 
                  This includes any health-related outcomes from following wellness suggestions provided by the Service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  10. Termination
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  We may terminate or suspend your account at any time without prior notice for violations of 
                  these Terms. You may also delete your account at any time through the app settings.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  11. Changes to Terms
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  We reserve the right to modify these Terms at any time. We will notify users of material 
                  changes. Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                  12. Contact
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  For questions about these Terms, please contact us:
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>CaptureIt™</strong><br />
                    Email: support@captureit.live<br />
                    Website: https://captureit.live
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button 
              className="bg-gradient-to-r from-sunset-500 via-warmth-500 to-ocean-500 hover:from-sunset-600 hover:via-warmth-600 hover:to-ocean-600"
              data-testid="return-home-button"
            >
              Return to CaptureIt™
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
