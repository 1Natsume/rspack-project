// components/GLTFModel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 定义 GLTF 模型的类型
interface GLTFModelProps {
  url: string;
  scale?: number;
  position?: [number, number, number];
  enableControls?: boolean;
  autoPlayAnimations?: boolean;
}

interface ModelInstance {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  cameras: THREE.Camera[];
  lights: THREE.Light[];
  userData: any;
}

const GLTFModelInner: React.FC<GLTFModelProps> = ({
  url,
  scale = 1,
  position = [0, 0, 0],
  autoPlayAnimations = true,
}) => {
  const { scene, camera, gl } = useThree();
  const [model, setModel] = useState<ModelInstance | null>(null);
  const [activeCamera, setActiveCamera] = useState<THREE.Camera | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const animationsRef = useRef<THREE.AnimationAction[]>([]);
  const [animations, setAnimations] = useState<string[]>([]);
    const [activeAnimations, setActiveAnimations] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // 清理之前的模型
    if (model) {
      scene.remove(model.scene);
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(model.scene);
      }
    }
    
    // 创建新的 GLTFLoader
    const loader = new GLTFLoader();
    
    loader.load(
      url,
      (gltf:any) => {
        const loadedModel: ModelInstance = {
          scene: gltf.scene,
          animations: gltf.animations,
          cameras: [],
          lights: [],
          userData: gltf.userData || {},
        };

        const animationNames = gltf.animations.map((anim: any) => anim.name || '未命名动画');
        setAnimations(animationNames);
        
        // 提取模型中的相机
        gltf.scene.traverse((child:any) => {
          if (child instanceof THREE.Camera) {
            loadedModel.cameras.push(child);
          }
          if (child instanceof THREE.Light) {
            loadedModel.lights.push(child);
          }
        });
        
        // 添加到场景
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(...position);
        scene.add(gltf.scene);
        
        setModel(loadedModel);
        
        // 使用模型中的第一个相机（如果存在）
        if (loadedModel.cameras.length > 0) {
          const modelCamera = loadedModel.cameras[0];
          
          // 将模型相机的参数复制到当前相机
          if (modelCamera instanceof THREE.PerspectiveCamera) {
            // camera.fov = modelCamera.fov;
            // camera.aspect = modelCamera.aspect;
            camera.near = modelCamera.near;
            camera.far = modelCamera.far;
          }
          
          camera.position.copy(modelCamera.position);
          camera.rotation.copy(modelCamera.rotation);
          camera.updateProjectionMatrix();
          
          setActiveCamera(modelCamera);
        }
        
        // 设置动画
        if (loadedModel.animations.length > 0 && autoPlayAnimations) {
          mixerRef.current = new THREE.AnimationMixer(loadedModel.scene);
          
          // loadedModel.animations.forEach((clip) => {
          //   const action = mixerRef.current!.clipAction(clip);
          //   animationsRef.current.push(action);
          //   action.play();
          // });
          const action = mixerRef.current!.clipAction(loadedModel.animations[4]);
            animationsRef.current.push(action);
            action.play();
          
        }
        
        console.log('模型加载完成:', {
          场景对象: gltf.scene,
          动画数量: loadedModel.animations.length,
          相机数量: loadedModel.cameras.length,
          灯光数量: loadedModel.lights.length,
        });
      },
      (progress: { loaded: number; total: number; }) => {
        // 加载进度回调
        console.log(`加载进度: ${(progress.loaded / progress.total) * 100}%`);
      },
      (error: any) => {
        console.error('加载 GLTF 模型失败:', error);
      }
    );
    
    return () => {
      // 清理函数
      if (model) {
        scene.remove(model.scene);
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [url, scale, position, autoPlayAnimations]);
  
  // 更新动画
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });
  
  // 辅助函数：切换模型中的相机
  const switchToModelCamera = (index: number = 0) => {
    if (model && model.cameras[index]) {
      const modelCamera = model.cameras[index];
      
      // 保存当前相机参数
      const currentCameraData = {
        position: camera.position.clone(),
        rotation: camera.rotation.clone(),
      };
      
      // 切换到模型相机
      if (modelCamera instanceof THREE.PerspectiveCamera) {
        // camera.fov = modelCamera.fov;
        // camera.aspect = modelCamera.aspect;
        camera.near = modelCamera.near;
        camera.far = modelCamera.far;
      }
      
      camera.position.copy(modelCamera.position);
      camera.rotation.copy(modelCamera.rotation);
      camera.updateProjectionMatrix();
      
      setActiveCamera(modelCamera);
    }
  };

  const toggleAnimation = (animationName: string) => {
    // 这里需要与 GLTFModelInner 组件通信来切换动画
    // 实际项目中可以使用 Context 或状态管理来实现
    console.log('切换动画:', animationName);
    
    setActiveAnimations((prev) => ({
      ...prev,
      [animationName]: !prev[animationName],
    }));
  };
  
  return null; // 这个组件只处理逻辑，不渲染任何内容
};

// 主组件
const GLTFModel: React.FC<GLTFModelProps> = ({
  url,
  scale = 1,
  position = [0, 0, 0],
  enableControls = true,
  autoPlayAnimations = true,
}) => {
  return (
    <Canvas
      style={{ width: '100%', height: '100vh' }}
      camera={{
        fov: 50,
        near: 0.1,
        far: 2000,
        position: [0, 5, 10],
      }}
      shadows
    >
      {/* <color attach="background" args={['#f0f0f0']} /> */}
      
      {/* 使用模型自带的场景内容 */}
      <GLTFModelInner
        url={url}
        scale={scale}
        position={position}
        autoPlayAnimations={autoPlayAnimations}
      />
      
      {/* 辅助控制器 */}
      {enableControls && <OrbitControls />}
      
      {/* 辅助网格和坐标轴 */}
      {/* <gridHelper args={[10, 10]} />
      <axesHelper args={[5]} /> */}
    </Canvas>
  );
};

export default GLTFModel;