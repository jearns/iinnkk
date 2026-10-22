"""Blender scene builder for a validated, local handwriting mesh (millimetres)."""
import json,math,sys
from pathlib import Path
import bpy
from mathutils import Vector

def build(scene_file,output=None):
    source=Path(scene_file).resolve();data=json.loads(source.read_text(encoding='utf-8'));model=data['mesh'];out=Path(output).resolve()if output else source.parent
    out.mkdir(parents=True,exist_ok=True)
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    points=model['vertices'];indices=model['triangles'];vertices=[tuple(points[i:i+3])for i in range(0,len(points),3)];faces=[tuple(indices[i:i+3])for i in range(0,len(indices),3)]
    geometry=bpy.data.meshes.new('Handwritten relief');geometry.from_pydata(vertices,[],faces);geometry.update()
    artwork=bpy.data.objects.new('Shoubi handwriting',geometry);bpy.context.collection.objects.link(artwork);bpy.context.view_layer.objects.active=artwork;artwork.select_set(True)
    material=bpy.data.materials.new('Warm bronze');material.diffuse_color=(.46,.29,.12,1);material.use_nodes=True;bsdf=material.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=(.46,.29,.12,1);bsdf.inputs['Metallic'].default_value=.25;bsdf.inputs['Roughness'].default_value=.4;artwork.data.materials.append(material)
    scene=bpy.context.scene;scene.unit_settings.system='METRIC';scene.unit_settings.scale_length=.001;scene.unit_settings.length_unit='MILLIMETERS'
    width=model['mm']['width'];height=model['mm']['height'];span=max(width,height)
    bpy.ops.object.camera_add(location=(span*.9,-span*1.2,span*1.5));camera=bpy.context.object;camera.rotation_euler=((Vector((0,0,0))-camera.location).to_track_quat('-Z','Y').to_euler());camera.data.type='ORTHO';camera.data.ortho_scale=span*1.65;scene.camera=camera
    for location,power,size in [((span,-span,span*2),2000,span),((-span,span,span*1.5),1300,span*.7)]:
        bpy.ops.object.light_add(type='AREA',location=location);lamp=bpy.context.object;lamp.data.energy=power*span/30;lamp.data.shape='DISK';lamp.data.size=size;lamp.rotation_euler=(Vector((0,0,0))-lamp.location).to_track_quat('-Z','Y').to_euler()
    scene.world.color=(.45,.42,.35);scene.render.engine='CYCLES';scene.cycles.samples=24;scene.render.resolution_x=1200;scene.render.resolution_y=1000;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(out/'render.png')
    bpy.ops.wm.save_as_mainfile(filepath=str(out/'handwriting.blend'));bpy.ops.render.render(write_still=True)
    return out/'handwriting.blend'

if __name__=='__main__':
    args=sys.argv[sys.argv.index('--')+1:]if '--'in sys.argv else sys.argv[1:]
    build(args[0]if args else Path(__file__).with_name('scene.json'),args[1]if len(args)>1 else None)
