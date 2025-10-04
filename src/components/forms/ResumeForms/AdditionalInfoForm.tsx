"use client";

import React, { useState } from "react";
import { useAdditionalInfo } from "@/context/ResumeContext/AdditionalInfo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

const languageProficiencies = ["Basic", "Conversational", "Fluent", "Native"] as const;

export const AdditionalInfoForm: React.FC = () => {
  const { additionalInfo, addLanguage, removeLanguage, updateAdditionalInfo } = useAdditionalInfo();

  const [newLanguage, setNewLanguage] = useState({ name: "", proficiency: "Basic" as typeof languageProficiencies[number] });
  const [newHobby, setNewHobby] = useState("");

  const handleAddLanguage = () => {
    if (!newLanguage.name) return;
    addLanguage({ id: uuidv4(), ...newLanguage });
    setNewLanguage({ name: "", proficiency: "Basic" });
  };

  const handleRemoveLanguage = (id: string) => {
    removeLanguage(id);
  };

  const handleAddHobby = () => {
    if (!newHobby) return;
    updateAdditionalInfo({ hobbies: [...additionalInfo.hobbies, newHobby] });
    setNewHobby("");
  };

  return (
    <div className="space-y-6">
      {/* Languages */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-medium">Languages</h3>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Language"
            value={newLanguage.name}
            onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
          />
          <select
            value={newLanguage.proficiency}
            onChange={(e) => setNewLanguage({ ...newLanguage, proficiency: e.target.value as typeof languageProficiencies[number] })}
          >
            {languageProficiencies.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <Button onClick={handleAddLanguage}>Add</Button>
        </div>
        <ul className="mt-2 space-y-1">
          {additionalInfo.languages.map(lang => (
            <li key={lang.id} className="border p-2 rounded flex justify-between">
              {lang.name} - {lang.proficiency}
              <Button size="icon" variant="ghost" onClick={() => handleRemoveLanguage(lang.id)}>✕</Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Hobbies */}
      <Card className="p-6 border-border/50">
        <h3 className="text-lg font-medium">Hobbies & Interests</h3>
        <div className="flex gap-2 mt-2">
          <Input placeholder="Add hobby" value={newHobby} onChange={(e) => setNewHobby(e.target.value)} />
          <Button onClick={handleAddHobby}>Add</Button>
        </div>
        <ul className="mt-2 space-y-1">
          {additionalInfo.hobbies.map((h, i) => (
            <li key={i} className="border p-2 rounded">{h}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
