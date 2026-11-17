import type { Project } from '../../data/portfolio'
import './ProjectPreview.css'

export function ProjectPreview({ project, large = false }: { project: Project; large?: boolean }) {
  if (project.screenshot) return <img className="project-screenshot" src={project.screenshot} alt={project.screenshotAlt || `${project.title} project screenshot`} loading="lazy" />

  return <div className={`project-preview project-preview--${project.preview}${large ? ' project-preview--large' : ''}`} aria-label={`Illustrative preview of ${project.title}; source screenshot pending`} role="img">
    <div className="preview-chrome"><span /><span /><span /><b>{project.preview === 'cricket' ? 'ANALYSIS / REPORT' : project.preview === 'payready' ? 'PAYREADY / WORKSPACE' : 'AITIZEN / REALM'}</b></div>
    {project.preview === 'aitizen' && <div className="preview-aitizen">
      <div className="preview-orb"><i /><i /><i /><em /></div>
      <div className="preview-aitizen-copy"><small>THE FUTURE OF EVERYDAY INTELLIGENCE</small><strong>AITIZEN<br />REALM</strong><span>Explore the architecture of autonomous action.</span></div>
      <div className="preview-coordinate">42° 08′ N / ENGINE 01</div>
    </div>}
    {project.preview === 'payready' && <div className="preview-payready">
      <div className="preview-payready-top"><span>PayReady <b>India</b></span><span>MERCHANT READINESS</span></div>
      <div className="preview-payready-main"><div><small>PREPARATION DASHBOARD</small><strong>Know what comes next.</strong><span>Clear guidance for merchant onboarding.</span><div className="preview-progress"><i /></div><small>YOUR READINESS CHECKLIST</small></div><div className="preview-checks"><span>✓ Identity documents</span><span>✓ Business details</span><span>○ Bank confirmation</span><span>○ Payment setup</span></div></div>
    </div>}
    {project.preview === 'cricket' && <div className="preview-cricket">
      <div className="preview-cricket-head"><span>SupeRR Selector / Phase 04</span><strong>Pressure performance</strong><small>DESCRIPTIVE ANALYSIS · VALIDATED PIPELINE</small></div>
      <div className="preview-chart"><div className="chart-grid" /><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="chart-line" /></div>
      <div className="preview-cricket-foot"><span>PRE-BALL FEATURES</span><span>BAT / BOWL COMPARISON</span><span>NO FINAL RANKINGS</span></div>
    </div>}
    <span className="preview-disclaimer">Visual interpretation · see repository for source</span>
  </div>
}
