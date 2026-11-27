import React, { useState } from 'react';
import Lanyard from './Lanyard-TS';
import { STUDENTS } from '../config';

const TEAM_ROLES: Record<string, string> = {
  achraf: 'Frontend Developer',
  abdelkrimi: 'AI Engineer',
  abdallah: 'Backend Developer',
  amine: 'Data Scientist',
  mazyouni: 'Network Engineer',
};

const TEAM_DESCRIPTIONS: Record<string, string> = {
  achraf: "Achraf conçoit l'interface de Hadir avec un souci du détail et de la fluidité. Il transforme les idées produit en expériences claires, rapides et accessibles pour les utilisateurs.",
  abdelkrimi: "Abdelkrim développe les briques d'intelligence artificielle derrière la reconnaissance faciale. Il veille à la précision, la robustesse et la performance du système.",
  abdallah: "Abdallah construit l'architecture backend et les APIs qui font tourner Hadir. Il garantit la fiabilité, la sécurité et la scalabilité de la plateforme.",
  amine: "Amine exploite les données pour améliorer la qualité du produit. Il analyse les usages et aide l'équipe à prendre des décisions basées sur des indicateurs concrets.",
  mazyouni: "Mazyouni assure la connectivité et l'infrastructure réseau du projet. Il s'occupe de la stabilité des déploiements et de la communication entre les services.",
};

export const TeamSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const total = STUDENTS.length;
  const member = STUDENTS[index];
  const role = TEAM_ROLES[member.id] || member.department;
  const description = TEAM_DESCRIPTIONS[member.id] || `Membre de l'équipe Hadir, spécialisé en ${member.department}.`;

  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="hadir-team-section" id="team" aria-labelledby="team-heading">
      <div className="hadir-team-block">
        <div className="hadir-team-header">
          <div className="hadir-about-badge">
            <span className="hadir-badge-dot" aria-hidden="true" />
            <span>Notre équipe</span>
          </div>
          <h2 id="team-heading" className="hadir-team-title">
            L&apos;équipe derrière <span className="hadir-highlight-orange">Hadir</span>
          </h2>
          <p className="hadir-team-subtitle">
            Cliquez sur la carte pour découvrir le membre suivant.
          </p>
        </div>

        <div className="hadir-team-layout">
          <div className="hadir-team-card-side">
            <div className="hadir-team-lanyard-canvas">
              <Lanyard
                frontImage={member.image}
                backImage={member.image}
                cardColor="#0D0F14"
                strapColor="#1a1a1a"
                metal="graphite"
                finish="glossy"
                anchor="center"
                size={0.66}
                strapLength={0.42}
                gravity={1}
                damping={0.55}
                elasticity={0.45}
                breeze={0.25}
                onCardClick={next}
              />
            </div>
            <div className="hadir-team-member-index hadir-team-index-below">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
          </div>

          <div className="hadir-team-detail-side">
            <div className="hadir-team-member-index">Profil équipe</div>
            <h3 className="hadir-team-member-name">{member.name}</h3>
            <p className="hadir-team-member-role">{role}</p>
            <p className="hadir-team-member-dept">{member.department}</p>
            <p className="hadir-team-member-desc">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
