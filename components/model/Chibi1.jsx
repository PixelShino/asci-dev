import React from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("/model/chibi1.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.material.geometry}
        material={materials["Material.001"]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/model/chibi1.glb");
