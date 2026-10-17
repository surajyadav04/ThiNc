# 3D Hand Model Asset Guide (GLTF / GLB)

To replace or supplement the procedural 3D hand rig with an external medical GLTF/GLB asset, place `hand.glb` into this folder:

```text
public/models/hand/hand.glb
```

## Recommended Node / Mesh Hierarchy

For full interactivity with the THiNC symptom explorer and anatomical layers, name your meshes or groups as follows:

```text
Hand
├── Skin (or Surface)
├── Bones
│   ├── Radius
│   ├── Ulna
│   ├── Carpal_Bones (or individual Scaphoid, Lunate, etc.)
│   └── Finger_Bones (Metacarpals, Phalanges)
├── Tendons (Flexor Retinaculum, Flexor Digitorum)
├── Ligaments (Transverse Carpal Ligament, TFCC)
└── Nerves
    ├── Median_Nerve (Primary clinical focus)
    ├── Ulnar_Nerve
    └── Radial_Nerve
```

## Automated Binding

The R3F loader automatically matches:
1. `Median_Nerve` or `*Nerve*`: Binds to the dynamic cyan/amber electrical pulse shader and Phalen compression alerts.
2. `Transverse_Carpal_Ligament` or `Carpal_Tunnel`: Binds to the canal pressure simulator.
3. `Skin` / `Surface`: Binds to the physical glassmorphic X-ray transmission mode (`MeshPhysicalMaterial`).
4. Camera transitions: GSAP orchestrates smooth cinematic pans between Wrist, Thumb, Fingers, and Nerves.
