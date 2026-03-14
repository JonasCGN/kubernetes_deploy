import subprocess
import shutil
import os

def copy_build():
    src = os.path.join("build", "web")
    dst = os.path.join("server", "build", "web")

    if not os.path.exists(src):
        print(f"Pasta de origem '{src}' não existe. Rode o build primeiro.")
        exit(1)

    if os.path.exists(dst):
        print(f"Removendo pasta destino '{dst}' antiga...")
        shutil.rmtree(dst)

    print(f"Copiando '{src}' para '{dst}'...")
    shutil.copytree(src, dst)
    print("Cópia finalizada com sucesso!")

if __name__ == "__main__":
    copy_build()
