import React from 'react'

interface TermsConditionsProps {
  onClose: () => void
}

export default function TermsConditions({ onClose }: TermsConditionsProps) {
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
          <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px' }}>📜 Terms & Conditions</h1>
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
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
            <p>By accessing and using the FLS Spinning Wheel application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on the FLS Spinning Wheel for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on the service</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>3. Disclaimer</h2>
            <p>The materials on FLS Spinning Wheel are provided as-is. FLS Spinning Wheel makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>4. Limitations</h2>
            <p>In no event shall FLS Spinning Wheel or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the service, even if FLS Spinning Wheel or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>5. Accuracy of Materials</h2>
            <p>The materials appearing on FLS Spinning Wheel could include technical, typographical, or photographic errors. FLS Spinning Wheel does not warrant that any of the materials on the service are accurate, complete, or current. FLS Spinning Wheel may make changes to the materials contained on the service at any time without notice.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>6. Links</h2>
            <p>FLS Spinning Wheel has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by FLS Spinning Wheel of the site. Use of any such linked website is at the user's own risk.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>7. Modifications</h2>
            <p>FLS Spinning Wheel may revise these terms of service for the service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.</p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>8. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#3498db', marginBottom: '12px' }}>9. Contact Us</h2>
            <p>If you have any questions about these Terms & Conditions, please contact us at: <strong>feedback@flswheel.com</strong></p>
          </section>
        </div>
      </div>
    </div>
  )
}
