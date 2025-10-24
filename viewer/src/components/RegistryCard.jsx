import React from 'react';

export default function RegistryCard({ registry }) {
  return (
    <div className="card">
      <h3>🔍 {registry.name}</h3>
      <p>URL: {registry.url}</p>
      <p>Version: {registry.version}</p>
      <p>Hash: {registry.hash}</p>
      <p>Status: {registry.status}</p>
    </div>
  );
}
