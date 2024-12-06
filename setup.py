from setuptools import setup, find_packages

setup(
    name="under_score",
    version="2.1.0",
    packages=find_packages(),
    install_requires=[
        'aiohttp>=3.8',
        'asyncpg>=0.27',
        'numpy>=1.24'
    ]
)
