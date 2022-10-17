一共有四种方法变化3D对象
1. position 移动(还有一个API->`translateOnAxis`在对象本地坐标上移动)
2. scale 缩放
3. rotation 旋转
4. quaternion 四元数(用于旋转)

mesh camera 都继承于Object3D,所有继承Object3D都可以使用上述API

所有旋转,平移,缩放都会编译为矩阵

平移是在对象的本地坐标上变化,如果对象旋转或者镜头选择后会使得对象平移方向不同


旋转可以使用`rotation:Euler->欧拉角`或者`quaternion:Quaternion->四元数`,不过无论你选择哪一个API最终都会更新另一个


Group可以作为一组对象结合,旋转偏移缩放会应用到集合下的所有物体中
