import React from 'react'

interface PrivacyPolicyProps {
  onClose: () => void
}

export default function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px' }}>🔒 Privacy Policy</h1>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ color: '#2c3e50', lineHeight: '1.8', fontSize: '14px' }}>
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>1. Introduction</h2>
            <p>FLS Spinning Wheel ("we", "us", "our") operates the FLS Spinning Wheel application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our service to you.</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li><strong>Personal Data:</strong> While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to names entered for the spinning wheel game.</li>
              <li><strong>Usage Data:</strong> We may also collect information on how the service is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, and the pages you visit.</li>
              <li><strong>Cookies and Tracking:</strong> We use cookies and similar tracking technologies to track activity on our service and hold certain information.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>3. Use of Data</h2>
            <p>FLS Spinning Wheel uses the collected data for various purposes:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>To provide and maintain the service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features of our service when you choose to do so</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To provide customer care and support</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>4. Security of Data</h2>
            <p>The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>5. Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the bottom of this Privacy Policy.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>6. Children's Privacy</h2>
            <p>Our service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without parental consent, we take steps to remove such information from our servers.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Access, update or to delete the information we have on file about you</li>
              <li>Restrict the processing of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request the portability of your personal information</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>8. Third-Party Links</h2>
            <p>Our service may contain links to other sites that are not operated by us. This Privacy Policy does not apply to third-party websites and we are not responsible for their privacy practices. We encourage you to review the privacy policy of every site you visit.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: <strong>feedback@flswheel.com</strong></p>
          </section>

          <div style={{ 
            backgroundColor: '#ecf0f1', 
            padding: '12px', 
            borderRadius: '6px', 
            marginTop: '24px',
            fontSize: '12px',
            color: '#7f8c8d'
          }}>
            <p style={{ margin: 0 }}>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
