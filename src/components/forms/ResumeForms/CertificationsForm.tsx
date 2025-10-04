"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Award } from "lucide-react";
import { useCertifications } from "@/context/ResumeContext/Certifications";
import { Certification } from "@/types/resume";

export const CertificationsForm: React.FC = () => {
  const { certifications, addCertification, removeCertification } = useCertifications();

  const [newCertification, setNewCertification] = useState<Omit<Certification, "id">>({
    name: "",
    issuer: "",
    dateEarned: "",
    expirationDate: undefined,
    credentialId: undefined,
    url: undefined,
  });

  const handleAddCertification = () => {
    if (!newCertification.name || !newCertification.issuer || !newCertification.dateEarned) return;
    addCertification(newCertification);
    setNewCertification({
      name: "",
      issuer: "",
      dateEarned: "",
      expirationDate: undefined,
      credentialId: undefined,
      url: undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Certification Form */}
      <Card className="p-6 border-dashed border-2 border-border/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Add Certification</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Certification Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="AWS Certified Solutions Architect"
                value={newCertification.name}
                onChange={(e) =>
                  setNewCertification({ ...newCertification, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Issuing Organization <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Amazon Web Services"
                  value={newCertification.issuer}
                  onChange={(e) =>
                    setNewCertification({ ...newCertification, issuer: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Date Earned <span className="text-destructive">*</span></Label>
                <Input
                  type="month"
                  value={newCertification.dateEarned}
                  onChange={(e) =>
                    setNewCertification({ ...newCertification, dateEarned: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Credential ID (Optional)</Label>
                <Input
                  placeholder="ABC123DEF456"
                  value={newCertification.credentialId || ""}
                  onChange={(e) =>
                    setNewCertification({ ...newCertification, credentialId: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Certification URL (Optional)</Label>
                <Input
                  placeholder="https://aws.amazon.com/verification"
                  value={newCertification.url || ""}
                  onChange={(e) =>
                    setNewCertification({ ...newCertification, url: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              className="w-full bg-gradient-primary hover:shadow-paper transition-all duration-300"
              onClick={handleAddCertification}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>
        </div>
      </Card>

      {/* Certification List */}
      <div className="space-y-2">
        {certifications.map((cert) => (
          <Card key={cert.id} className="p-4 flex justify-between items-center border-dashed border-2 border-border/50">
            <div>
              <h4 className="font-medium">{cert.name}</h4>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              {cert.dateEarned && (
                <p className="text-xs text-muted-foreground">Earned: {cert.dateEarned}</p>
              )}
              {cert.url && (
                <a href={cert.url} target="_blank" className="text-primary text-xs underline">
                  {cert.url}
                </a>
              )}
            </div>
            <Button variant="destructive" size="sm" onClick={() => removeCertification(cert.id)}>
              Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
